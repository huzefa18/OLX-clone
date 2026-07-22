import { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

let socket = null;

export default function ChatBox({ show, onHide, product, seller }) {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState("");
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const bottomRef = useRef(null);

  const roomId = product && seller ? `${product._id}-${seller._id}` : null;

  // ── Connect socket + load history when modal opens ──────────────────────
  useEffect(() => {
    if (!show || !product || !seller || !user) return;

    setLoading(true);
    api
      .get(`/messages/${product._id}/${seller._id}`)
      .then(({ data }) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    socket = io(API_BASE, { transports: ["websocket"] });
    socket.emit("join-room", roomId);
    socket.on("receive-message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [show, product?._id, seller?._id, user?.id]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !socket || sending) return;
    setSending(true);
    socket.emit("send-message", {
      senderId:   user.id,
      receiverId: seller._id,
      productId:  product._id,
      text:       text.trim(),
      roomId,
    });
    setText("");
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!product || !seller) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      {/* ── Header ── */}
      <Modal.Header
        closeButton
        closeVariant="white"
        style={{ backgroundColor: "#002f34", color: "#fff", border: "none" }}
      >
        <Modal.Title style={{ fontSize: "0.95rem", fontWeight: 600 }}>
          💬 Chat about: <span style={{ fontWeight: 700 }}>{product.title}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: 0 }}>
        {/* ── Seller strip ── */}
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid #eee",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white"
              style={{
                width: 36, height: 36,
                backgroundColor: "#002f34",
                fontWeight: "bold",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              {seller.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {seller.name}
              </div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                Seller
              </div>
            </div>
          </div>
        </div>

        {/* ── Message list ── */}
        <div style={{ height: 340, overflowY: "auto", padding: "16px" }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" size="sm" style={{ color: "#002f34" }} />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted py-5" style={{ fontSize: "0.875rem" }}>
              No messages yet. Say hello! 👋
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe =
                (msg.sender?._id ?? msg.sender)?.toString() === user?.id?.toString();
              return (
                <div
                  key={i}
                  className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"}`}
                >
                  <div
                    style={{
                      maxWidth: "72%",
                      padding: "8px 12px",
                      borderRadius: isMe
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                      backgroundColor: isMe ? "#002f34" : "#f0f0f0",
                      color: isMe ? "#fff" : "#333",
                      fontSize: "0.875rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                    <div
                      style={{ fontSize: "0.68rem", opacity: 0.65, marginTop: 3 }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div
          style={{ padding: "12px 16px", borderTop: "1px solid #eee", backgroundColor: "#fafafa" }}
        >
          {user ? (
            <div className="d-flex gap-2 align-items-center">
              <Form.Control
                type="text"
                placeholder="Type a message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKey}
                style={{ borderRadius: 20, fontSize: "0.875rem", border: "1px solid #ddd" }}
              />
              <Button
                onClick={handleSend}
                disabled={!text.trim() || sending}
                style={{
                  backgroundColor: "#002f34",
                  border: "none",
                  borderRadius: 20,
                  padding: "7px 18px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Send
              </Button>
            </div>
          ) : (
            <p
              className="text-muted text-center mb-0 small"
              style={{ cursor: "pointer" }}
              onClick={() => { onHide(); navigate("/login"); }}
            >
              <span style={{ color: "#002f34", textDecoration: "underline" }}>Login</span>{" "}
              to chat with the seller
            </p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
