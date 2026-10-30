import { useState } from "react";
import { ADMIN_SECTIONS, type AdminRole, type AdminSection } from "@shared/types";
import { cx } from "@/lib/format";
import { Check } from "@/components/icons";
import { adminApi, errorMessage, fieldErrors } from "./adminApi";
import { useAdminData } from "./hooks";
import { toast } from "./toast";
import { Badge, ConfirmDialog, Group, LoadError, PageHeader, SkeletonRows, Spinner, TextField } from "./ui";

export default function RolesPage() {
  const { data, error, loading, reload, mutate } = useAdminData<{ items: AdminRole[] }>("/api/admin/roles");
  const replace = (role: AdminRole) => mutate((d) => ({ items: d.items.map((r) => (r.id === role.id ? role : r)) }));

  return (
    <div>
      <PageHeader
        title="Roles"
        subtitle="Each role signs in with its own password and only sees the sections ticked here. Changing a role signs out everyone using it."
      />
      {error && !data ? (
        <LoadError error={error} onRetry={reload} />
      ) : loading && !data ? (
        <SkeletonRows count={5} />
      ) : (
        <div className="flex flex-col gap-8">
          {data?.items.map((r) => (r.developer ? <DeveloperCard key={r.id} role={r} /> : <RoleCard key={`${r.id}-${r.hasPassword}`} role={r} onSaved={replace} />))}
        </div>
      )}
    </div>
  );
}

function DeveloperCard({ role }: { role: AdminRole }) {
  return (
    <Group
      title={
        <span className="flex items-center gap-2">
          {role.name} <Badge tone="blue">Full access</Badge>
        </span>
      }
      footer="Change it with: npx wrangler secret put ADMIN_PASSWORD"
    >
      <p className="text-[15px] text-muted">
        Signs in with the <code className="font-mono text-[13px]">ADMIN_PASSWORD</code> secret. Always has every section, plus this Roles page.
      </p>
    </Group>
  );
}

function RoleCard({ role, onSaved }: { role: AdminRole; onSaved: (r: AdminRole) => void }) {
  const [name, setName] = useState(role.name);
  const [perms, setPerms] = useState<AdminSection[]>(role.permissions);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<"remove" | "signout" | null>(null);

  const permsChanged = perms.length !== role.permissions.length || perms.some((p) => !role.permissions.includes(p));
  const dirty = name.trim() !== role.name || permsChanged || password !== "";

  const toggle = (key: AdminSection) => setPerms((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  const save = async (patch: Record<string, unknown>, done: string) => {
    setSaving(true);
    setErrors({});
    try {
      const res = await adminApi.put<{ item: AdminRole }>(`/api/admin/roles/${role.id}`, patch);
      onSaved(res.item);
      setPassword("");
      toast.success(done);
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onSave = () => {
    const patch: Record<string, unknown> = {};
    if (name.trim() !== role.name) patch.name = name.trim();
    if (permsChanged) patch.permissions = ADMIN_SECTIONS.map((s) => s.key).filter((k) => perms.includes(k));
    if (password) patch.password = password;
    void save(patch, `${name.trim() || role.name} saved.`);
  };

  const signOut = async () => {
    setSaving(true);
    try {
      await adminApi.post(`/api/admin/roles/${role.id}/sign-out`);
      toast.success(`Everyone using ${role.name} has been signed out.`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
      setConfirm(null);
    }
  };

  return (
    <Group
      title={
        <span className="flex items-center gap-2">
          {role.name}
          {role.hasPassword ? <Badge tone="green">Can sign in</Badge> : <Badge tone="amber">No password yet</Badge>}
        </span>
      }
      actions={
        <span className="flex gap-1">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirm("signout")} disabled={saving}>
            Sign out all
          </button>
          {role.hasPassword && (
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirm("remove")} disabled={saving}>
              Remove password
            </button>
          )}
        </span>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Role name" value={name} onChange={setName} maxLength={60} error={errors.name} />
        <TextField
          label={role.hasPassword ? "New password" : "Password"}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          optional={role.hasPassword}
          hint={role.hasPassword ? "Leave empty to keep the current one." : "At least 8 characters. Must differ from every other role."}
          error={errors.password}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="label !mb-0">Can open</p>
          <span className="flex gap-3 text-[13px]">
            <button type="button" className="text-accent hover:underline" onClick={() => setPerms(ADMIN_SECTIONS.map((s) => s.key))}>
              All
            </button>
            <button type="button" className="text-accent hover:underline" onClick={() => setPerms([])}>
              None
            </button>
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ADMIN_SECTIONS.map((s) => {
            const on = perms.includes(s.key);
            return (
              <li key={s.key}>
                <label
                  className={cx(
                    "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 text-[14px] transition-colors",
                    on ? "border-accent/60 bg-accent/10 text-fg" : "border-line text-muted hover:bg-white/[0.04]",
                  )}
                >
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(s.key)} />
                  <span
                    className={cx("flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", on ? "border-accent bg-accent text-white" : "border-line-strong")}
                    aria-hidden="true"
                  >
                    {on && <Check size={13} />}
                  </span>
                  {s.label}
                </label>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-[13px] text-dim">Every role can see the dashboard and upload images. Event and project lists stay readable so pickers work.</p>
      </div>

      <div className="flex justify-end gap-2">
        {dirty && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={saving}
            onClick={() => {
              setName(role.name);
              setPerms(role.permissions);
              setPassword("");
              setErrors({});
            }}
          >
            Discard
          </button>
        )}
        <button type="button" className="btn btn-primary btn-sm" onClick={onSave} disabled={saving || !dirty || !name.trim()}>
          {saving && <Spinner size={14} />}
          Save
        </button>
      </div>

      <ConfirmDialog
        open={confirm === "remove"}
        title={`Remove the ${role.name} password?`}
        body="Nobody will be able to sign in as this role until you set a new password. Anyone signed in now is signed out."
        confirmLabel="Remove password"
        busy={saving}
        onCancel={() => setConfirm(null)}
        onConfirm={() => void save({ password: "" }, `${role.name} password removed.`).then(() => setConfirm(null))}
      />
      <ConfirmDialog
        open={confirm === "signout"}
        title={`Sign out everyone using ${role.name}?`}
        body="They'll need the password to sign in again."
        confirmLabel="Sign out"
        danger={false}
        busy={saving}
        onCancel={() => setConfirm(null)}
        onConfirm={() => void signOut()}
      />
    </Group>
  );
}
