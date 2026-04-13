"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  CheckCircle,
} from "lucide-react";

type Role = "admin" | "editor" | "viewer" | "client";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  joinedAt: string;
  lastActive: string;
}

const mockMembers: TeamMember[] = [
  { id: "m1", name: "John Everett", email: "john@acme.com", role: "admin", joinedAt: "2026-01-10", lastActive: "Just now" },
  { id: "m2", name: "Sarah Chen", email: "sarah@acme.com", role: "editor", joinedAt: "2026-01-20", lastActive: "2h ago" },
  { id: "m3", name: "Mike Johnson", email: "mike@acme.com", role: "viewer", joinedAt: "2026-02-05", lastActive: "1d ago" },
  { id: "m4", name: "Emily Davis", email: "emily@acme.com", role: "client", joinedAt: "2026-03-01", lastActive: "3d ago" },
];

const roleConfig: Record<Role, { label: string; color: string; description: string }> = {
  admin: {
    label: "Admin",
    color: "bg-warm/10 text-warm",
    description: "Full access to all features and settings",
  },
  editor: {
    label: "Editor",
    color: "bg-[#3f5870]/10 text-[#3f5870]",
    description: "Create and publish content, manage scheduling",
  },
  viewer: {
    label: "Viewer",
    color: "bg-[#625d58]/10 text-[#625d58]",
    description: "View analytics and scheduled content only",
  },
  client: {
    label: "Client",
    color: "bg-[#a28443]/10 text-[#a28443]",
    description: "Limited view, can approve content only",
  },
};

function RoleBadge({ role }: { role: Role }) {
  const config = roleConfig[role];
  return (
    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", config.color)}>
      {config.label}
    </span>
  );
}

function MembersList({ members }: { members: TeamMember[] }) {
  return (
    <div className="bg-panel border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#625d58]" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-9 pr-4 py-2 bg-paper border border-border rounded-md text-sm text-ink placeholder:text-[#625d58] focus:outline-none focus:ring-1 focus:ring-warm"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-warm text-paper rounded-md text-sm font-medium hover:bg-warm/90 transition-colors">
          <Plus className="size-4" />
          Invite
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-[11px] uppercase tracking-wider text-[#625d58] font-medium px-4 py-3">Member</th>
            <th className="text-left text-[11px] uppercase tracking-wider text-[#625d58] font-medium px-4 py-3">Role</th>
            <th className="text-left text-[11px] uppercase tracking-wider text-[#625d58] font-medium px-4 py-3">Joined</th>
            <th className="text-left text-[11px] uppercase tracking-wider text-[#625d58] font-medium px-4 py-3">Last active</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-border last:border-0 hover:bg-shell/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[#3f5870] flex items-center justify-center">
                    <span className="text-paper text-[11px] font-bold">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{member.name}</p>
                    <p className="text-[10px] text-[#625d58]">{member.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <RoleBadge role={member.role} />
              </td>
              <td className="px-4 py-3 text-xs text-[#625d58]">
                {new Date(member.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
              <td className="px-4 py-3 text-xs text-[#625d58]">{member.lastActive}</td>
              <td className="px-4 py-3">
                <button className="p-1.5 hover:bg-shell rounded transition-colors text-[#625d58]">
                  <MoreHorizontal className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RolesOverview() {
  const roles = Object.entries(roleConfig).map(([role, config]) => ({
    value: role as Role,
    ...config,
    count: mockMembers.filter((m) => m.role === role).length,
  }));

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-ink mb-4">Roles overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div key={role.value} className="p-4 bg-shell rounded-lg">
            <div className={cn("text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-2", role.color)}>
              {role.label}
            </div>
            <p className="text-2xl font-medium text-ink">{role.count}</p>
            <p className="text-[10px] text-[#625d58]">{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingInvites() {
  const invites = [
    { id: "i1", email: "alex@acme.com", role: "editor" as Role, sentAt: "2d ago" },
    { id: "i2", email: "jordan@client.com", role: "client" as Role, sentAt: "5d ago" },
  ];

  if (invites.length === 0) return null;

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-ink mb-4">Pending invites</h2>
      <div className="space-y-2">
        {invites.map((invite) => (
          <div key={invite.id} className="flex items-center justify-between p-3 bg-shell rounded-lg">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-[#a28443]/20 flex items-center justify-center">
                <Mail className="size-4 text-[#a28443]" />
              </div>
              <div>
                <p className="text-sm text-ink">{invite.email}</p>
                <p className="text-[10px] text-[#625d58]">Sent {invite.sentAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RoleBadge role={invite.role} />
              <button className="text-xs text-[#625d58] hover:text-[#9e4d3b]">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityLog() {
  const activities = [
    { id: "a1", action: "joined the team", user: "John Everett", target: "", time: "Just now" },
    { id: "a2", action: "changed role to", user: "Sarah Chen", target: "Admin", time: "2h ago" },
    { id: "a3", action: "scheduled a post", user: "Mike Johnson", target: "Instagram", time: "1d ago" },
  ];

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-ink mb-4">Recent activity</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-1">
              <CheckCircle className="size-4 text-[#536443]" />
            </div>
            <div>
              <p className="text-sm text-ink">
                <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                {activity.target && <span className="font-medium">{activity.target}</span>}
              </p>
              <p className="text-[10px] text-[#625d58]">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <RolesOverview />
      <MembersList members={mockMembers} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PendingInvites />
        <ActivityLog />
      </div>
    </div>
  );
}