// FieldReady scene simulator: local engine.
// Stands in for the platform's room server (WebSocket at /ws/{room}), which was
// not included in the exported game files. It runs the same rules (logic.js) in
// the browser and saves progress in localStorage, so the simulator works on a
// static host with no server. client.js uses window.LocalSocket instead of
// WebSocket when it is present.
import { setup, applyAction, validateAction, viewFor } from "./logic.js";

const KEY = "fieldready:scene-state:v1";

class LocalSocket extends EventTarget {
  constructor() {
    super();
    this.readyState = 0;
    this.player = null;
    setTimeout(() => {
      this.readyState = 1;
      this.dispatchEvent(new Event("open"));
    }, 0);
  }

  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.players)) return s;
      }
    } catch {}
    return null;
  }

  save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }

  emit(msg) {
    setTimeout(() => {
      const event = new Event("message");
      event.data = JSON.stringify(msg);
      this.dispatchEvent(event);
    }, 0);
  }

  send(raw) {
    if (raw === "__ping") return;
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }
    let state = this.load();
    if (msg.type === "join") {
      this.player = msg.playerId;
      if (!state || !state.players.includes(this.player)) {
        state = setup([this.player]);
        this.save(state);
      }
      this.emit({ type: "state", view: viewFor(state, this.player) });
      return;
    }
    if (msg.type === "action" && state) {
      const check = validateAction(state, this.player, msg.action);
      if (!check.ok) {
        this.emit({ type: "error", error: check.error });
        return;
      }
      state = applyAction(state, this.player, msg.action);
      this.save(state);
      this.emit({ type: "state", view: viewFor(state, this.player) });
    }
  }

  close() {
    this.readyState = 3;
  }
}

window.LocalSocket = LocalSocket;
