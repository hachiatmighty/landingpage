import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";
import { Archive, ArrowUp, ChevronLeft, Forward, PenSquare, Reply, Search, Trash2 } from "lucide-react";
import { INSETS, SCREEN } from "../lib/device";
import { MAIL } from "../lib/fonts";
import { DAMI, GOAL, SADE } from "../lib/layout";

/**
 * Dami's phone: a plain, light mail app. It is deliberately generic (no real client's chrome), so the
 * only brand on screen is Bestday's, in the emails themselves. The email bodies follow the real
 * templates: the yellow rule, the "Bestday" heading, plain paragraphs and the yellow button.
 */

const INK = "#111111";
const MUTED = "#6B6B6B";
const LINE = "#E8E8E6";
const UNREAD = "#2F6BFF";
const YELLOW = "#FFDE59";
const GUTTER = 18;

const text = (size: number, weight = 400, color = INK): CSSProperties => ({ fontFamily: MAIL, fontSize: size, fontWeight: weight, color, letterSpacing: -0.15, lineHeight: 1.35 });

export const SENDER = { name: "Bestday", address: "circle@send.bestday.ai" };

export const SUBJECTS = {
  invite: `${SADE.full} wants you on their goal: “${GOAL.title}”`,
  joined: `You’re in ${SADE.first}’s Circle`,
  update: `${SADE.full} just made an update to their goal`,
} as const;

/* ---------- Inbox ---------- */

interface Row {
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
  bestday?: boolean;
  initial?: string;
  tint?: string;
}

const FILLER: Row[] = [
  { from: "Ayo Martins", subject: "Dinner on Friday?", preview: "We booked the place on Bode Thomas, 7:30. You in?", time: "9:12", initial: "A", tint: "#E7D9C9" },
  { from: "Northside Run Club", subject: "This week’s routes", preview: "Tuesday tempo along the canal, Saturday long run from…", time: "Yesterday", initial: "N", tint: "#D3E3D6" },
  { from: "Lena Brooks", subject: "Re: photos from the weekend", preview: "These are so good. Sending the rest tonight!", time: "Yesterday", initial: "L", tint: "#D8DCEB" },
  { from: "Studio Nine", subject: "Your class is booked", preview: "Thursday 6:30pm · Mat 12 · Bring water", time: "Mon", initial: "S", tint: "#EBD6DD" },
  { from: "Tolu", subject: "Flight details", preview: "Landing at 4:05, terminal 2. Can you grab me?", time: "Sun", initial: "T", tint: "#E3E0CF" },
];

export const INBOX_ROW_HEIGHT = 86;
/** The first row's centre, for the tap that opens it. */
export const INBOX_POINTS = { first: { x: 196, y: INSETS.top + 128 + INBOX_ROW_HEIGHT / 2 } } as const;

const SenderAvatar = ({ row, size = 40 }: { row: Pick<Row, "bestday" | "initial" | "tint">; size?: number }) =>
  row.bestday ? (
    <Img src={staticFile("app-icon.svg")} style={{ width: size, height: size, borderRadius: size / 2, flexShrink: 0 }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: size / 2, flexShrink: 0, background: row.tint, display: "flex", alignItems: "center", justifyContent: "center", ...text(size * 0.42, 600, "#3A3A3A") }}>{row.initial}</div>
  );

function InboxRow({ row, pressed = 0 }: { row: Row; pressed?: number }) {
  return (
    <div style={{ display: "flex", gap: 12, height: INBOX_ROW_HEIGHT, padding: `14px ${GUTTER}px 0`, boxSizing: "border-box", borderBottom: `1px solid ${LINE}`, background: `rgba(0,0,0,${pressed * 0.06})`, position: "relative" }}>
      {row.unread && <div style={{ position: "absolute", left: 5, top: 30, width: 8, height: 8, borderRadius: 4, background: UNREAD }} />}
      <SenderAvatar row={row} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={text(15, row.unread ? 700 : 500)}>{row.from}</span>
          <span style={text(13, row.unread ? 600 : 400, row.unread ? UNREAD : MUTED)}>{row.time}</span>
        </div>
        <div style={{ ...text(14, row.unread ? 600 : 400), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.subject}</div>
        <div style={{ ...text(14, 400, MUTED), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.preview}</div>
      </div>
    </div>
  );
}

export const bestdayRow = (subject: string, preview: string): Row => ({ from: SENDER.name, subject, preview, time: "now", unread: true, bestday: true });

/** The inbox, with new mail sliding in at the top: each `arrivals` entry has a 0 → 1 `t`. */
export function Inbox({ arrivals, pressed = 0 }: { arrivals: { row: Row; t: number }[]; pressed?: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: INSETS.top, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `6px ${GUTTER}px 0` }}>
        <span style={text(32, 700)}>Inbox</span>
        <PenSquare size={22} color={INK} />
      </div>
      <div style={{ margin: `12px ${GUTTER}px 10px`, height: 40, borderRadius: 12, background: "#F0F0EE", display: "flex", alignItems: "center", gap: 8, padding: "0 12px" }}>
        <Search size={17} color={MUTED} />
        <span style={text(16, 400, MUTED)}>Search mail</span>
      </div>
      <div style={{ borderTop: `1px solid ${LINE}` }}>
        {[...arrivals].reverse().map(({ row, t }, i) => (
          <div key={i} style={{ height: t * INBOX_ROW_HEIGHT, overflow: "hidden", opacity: t }}>
            <InboxRow row={row} pressed={i === arrivals.length - 1 ? pressed : 0} />
          </div>
        ))}
        {FILLER.map((row) => (
          <InboxRow key={row.from} row={row} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Email bodies ---------- */

const P = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => <div style={{ ...text(16, 400, "#1F1F1F"), lineHeight: "24px", marginTop: 16, ...style }}>{children}</div>;

/** A highlighter stroke drawn left to right as `t` goes 0 → 1. */
export const Marker = ({ t, children }: { t: number; children: ReactNode }) => (
  <span
    style={{
      backgroundImage: `linear-gradient(${YELLOW}, ${YELLOW})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${t * 100}% 42%`,
      backgroundPosition: "0 88%",
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    }}
  >
    {children}
  </span>
);

const Button = ({ label, scale = 1 }: { label: string; scale?: number }) => (
  <div style={{ display: "inline-block", marginTop: 22, padding: "14px 24px", borderRadius: 10, background: YELLOW, transform: `scale(${scale})`, transformOrigin: "left center", ...text(16, 700) }}>{label}</div>
);

export function InviteBody({ acceptScale = 1 }: { acceptScale?: number }) {
  return (
    <>
      <P>Hey there,</P>
      <P>{SADE.full} wants you to join them on a goal:</P>
      <P style={{ fontWeight: 700 }}>{GOAL.title}</P>
      <P>Due {GOAL.dueLong}</P>
      <P>{SADE.full} is using Bestday to achieve meaningful goals with people who care. They want you in their Circle for this one.</P>
      <P>Accept the invite below to start receiving updates and comment on this goal.</P>
      <Button label="Accept Invitation" scale={acceptScale} />
    </>
  );
}

export function JoinedBody({ marker = 0 }: { marker?: number }) {
  return (
    <>
      <P>Hey {DAMI.first},</P>
      <P style={{ fontWeight: 700 }}>You’re now part of {SADE.full}’s Circle.</P>
      <P>You’re connected to “{GOAL.title}”. We’ll send updates about this goal to this email address.</P>
      <P>
        Reply to this email to comment on the goal. <Marker t={marker}>No Bestday account is needed.</Marker>
      </P>
      <P>Want to see the full Circle and goal activity? Download the Bestday app:</P>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {["iPhone", "Android"].map((p) => (
          <div key={p} style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 10, padding: "10px 12px" }}>
            <div style={text(12, 400, MUTED)}>Download for</div>
            <div style={text(16, 700)}>{p}</div>
          </div>
        ))}
      </div>
      <Button label="Open Bestday" />
    </>
  );
}

/** New template: the email a Circle member gets each time the goal owner updates their goal. */
export function UpdateBody({ from, to, fill, marker = 0 }: { from: number; to: number; fill: number; marker?: number }) {
  const value = Math.round(from + (to - from) * fill);
  return (
    <>
      <P>Hey {DAMI.first},</P>
      <P style={{ fontWeight: 700 }}>{SADE.full} just made an update to their goal.</P>
      <div style={{ marginTop: 16, border: `1px solid ${LINE}`, borderRadius: 14, padding: "16px 16px 18px", background: "#FAFAF8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Img src={staticFile(SADE.photo)} style={{ width: 34, height: 34, borderRadius: 17, objectFit: "cover" }} />
          <div>
            <div style={text(16, 700)}>{GOAL.title}</div>
            <div style={text(13, 400, MUTED)}>{GOAL.due}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 14 }}>
          <span style={{ ...text(30, 800), letterSpacing: -0.8 }}>{value}%</span>
          <span style={text(14, 500, MUTED)}>up from {from}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: "#ECECE8", marginTop: 8, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${value}%`, borderRadius: 4, background: YELLOW }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${from}%`, borderRadius: 4, background: "#E9C93E" }} />
        </div>
      </div>
      <P style={{ fontWeight: 600 }}>
        <Marker t={marker}>Reply to this email to check in on them.</Marker>
      </P>
      <P style={{ ...text(14, 400, MUTED), marginTop: 22 }}>— Bestday · Your Coachieving Partner</P>
    </>
  );
}

/* ---------- Message view ---------- */

export const MESSAGE_POINTS = { reply: { x: 104, y: SCREEN.height - INSETS.bottom - 30 } } as const;

/**
 * One open email: the subject, the sender, then the Bestday template. `scroll` moves the body up
 * (points); `children` is the template's content after the yellow rule and the heading.
 */
export function Message({ subject, scroll = 0, replyScale = 1, children }: { subject: string; scroll?: number; replyScale?: number; children: ReactNode }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-scroll}px)` }}>
        <div style={{ height: INSETS.top + 48 }} />
        <div style={{ padding: `4px ${GUTTER}px 0` }}>
          <div style={{ ...text(22, 700), lineHeight: "28px", letterSpacing: -0.4 }}>{subject}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, paddingBottom: 14, borderBottom: `1px solid ${LINE}` }}>
            <SenderAvatar row={{ bestday: true }} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={text(15, 700)}>{SENDER.name}</span>
                <span style={text(13, 400, MUTED)}>now</span>
              </div>
              <div style={text(13, 400, MUTED)}>to me</div>
            </div>
          </div>
          <div style={{ paddingTop: 22 }}>
            <div style={{ height: 5, borderRadius: 3, background: YELLOW }} />
            <div style={{ ...text(26, 800), letterSpacing: -0.6, marginTop: 20 }}>Bestday</div>
            {children}
            <div style={{ height: 160 }} />
          </div>
        </div>
      </div>
      {/* top bar */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: INSETS.top + 44, paddingTop: INSETS.top, boxSizing: "border-box", background: "rgba(255,255,255,0.96)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${INSETS.top}px 12px 0 6px`, zIndex: 2 }}>
        <span style={{ display: "flex", alignItems: "center", ...text(17, 400, UNREAD) }}>
          <ChevronLeft size={26} color={UNREAD} />
          Inbox
        </span>
        <span style={{ display: "flex", gap: 20 }}>
          <Archive size={20} color={INK} />
          <Trash2 size={20} color={INK} />
        </span>
      </div>
      {/* bottom actions */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: INSETS.bottom + 62, background: "rgba(255,255,255,0.97)", borderTop: `1px solid ${LINE}`, display: "flex", gap: 10, padding: `10px ${GUTTER}px 0`, boxSizing: "border-box", zIndex: 2 }}>
        {[
          { label: "Reply", Icon: Reply, scale: replyScale },
          { label: "Forward", Icon: Forward, scale: 1 },
        ].map(({ label, Icon, scale }) => (
          <div key={label} style={{ flex: 1, height: 42, borderRadius: 21, border: `1.5px solid #CFCFCC`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${scale})`, ...text(15, 600) }}>
            <Icon size={18} color={INK} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Reply composer ---------- */

export const COMPOSE_TOP = 70;
export const COMPOSE_POINTS = { send: { x: SCREEN.width - 34, y: COMPOSE_TOP + 34 } } as const;

/** The reply sheet sliding up over the message, with Dami's reply typed into it. */
export function ReplySheet({ open, typed, caret, sendScale = 1, subject }: { open: number; typed: string; caret: boolean; sendScale?: number; subject: string }) {
  const ready = typed.length > 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", opacity: open, zIndex: 20 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: COMPOSE_TOP, bottom: 0, zIndex: 21, background: "#fff", borderTopLeftRadius: 14, borderTopRightRadius: 14, transform: `translateY(${(1 - open) * 105}%)`, boxShadow: "0 -6px 24px rgba(0,0,0,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `16px ${GUTTER}px 14px` }}>
          <span style={text(17, 400, UNREAD)}>Cancel</span>
          <span style={text(16, 700)}>Reply</span>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: ready ? UNREAD : "#CFCFCC", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sendScale})` }}>
            <ArrowUp size={20} color="#fff" strokeWidth={2.6} />
          </div>
        </div>
        {[
          ["To:", `${SENDER.name} <${SENDER.address}>`],
          ["Subject:", `Re: ${subject}`],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", gap: 6, padding: `11px ${GUTTER}px`, borderTop: `1px solid ${LINE}`, whiteSpace: "nowrap", overflow: "hidden" }}>
            <span style={text(15, 400, MUTED)}>{label}</span>
            <span style={{ ...text(15, 400), overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${LINE}`, padding: `16px ${GUTTER}px` }}>
          <span style={{ ...text(19, 400), lineHeight: "27px" }}>
            {typed}
            <span style={{ display: "inline-block", width: 2, height: 22, marginLeft: 1, verticalAlign: -4, background: UNREAD, opacity: caret ? 1 : 0 }} />
          </span>
          <div style={{ ...text(14, 400, "#9A9A9A"), marginTop: 26, borderLeft: `2px solid ${LINE}`, paddingLeft: 10 }}>
            Bestday &lt;{SENDER.address}&gt; wrote:
            <br />
            {SADE.full} just made an update to their goal…
          </div>
        </div>
      </div>
    </>
  );
}
