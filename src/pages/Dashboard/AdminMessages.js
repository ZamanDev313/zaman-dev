
import React, { useCallback, useEffect, useState } from "react";
import {
  FiMail,
  FiSearch,
  FiEye,
  FiTrash2,
  FiX,
  FiInbox,
} from "react-icons/fi";
import { supabase } from "../../supabaseClient";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setMessages(data || []);
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError(
        "Messages load nahi ho sake. Admin login aur Supabase permissions check karein."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const filteredMessages = messages.filter((message) => {
    const searchableText =
      `${message.name} ${message.email} ${message.message}`.toLowerCase();

    const matchesSearch = searchableText.includes(
      search.trim().toLowerCase()
    );

    const matchesFilter =
      filter === "All" ||
      (filter === "Read" && message.is_read) ||
      (filter === "Unread" && !message.is_read);

    return matchesSearch && matchesFilter;
  });

  const updateReadStatus = async (message, isRead) => {
    setActionLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("messages")
        .update({ is_read: isRead })
        .eq("id", message.id);

      if (updateError) throw updateError;

      setMessages((previous) =>
        previous.map((item) =>
          item.id === message.id
            ? { ...item, is_read: isRead }
            : item
        )
      );

      setSelectedMessage((previous) =>
        previous?.id === message.id
          ? { ...previous, is_read: isRead }
          : previous
      );
    } catch (err) {
      console.error("Update read status error:", err);
      setError("Message ka read status update nahi ho saka.");
    } finally {
      setActionLoading(false);
    }
  };

  const openMessage = async (message) => {
    setSelectedMessage(message);

    if (!message.is_read) {
      await updateReadStatus(message, true);
    }
  };

  const deleteMessage = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is message ko permanently delete karna chahte hain?"
    );

    if (!confirmed) return;

    setActionLoading(true);
    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("messages")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setMessages((previous) =>
        previous.filter((message) => message.id !== id)
      );

      setSelectedMessage((previous) =>
        previous?.id === id ? null : previous
      );
    } catch (err) {
      console.error("Delete message error:", err);
      setError("Message delete nahi ho saka.");
    } finally {
      setActionLoading(false);
    }
  };

  const unreadCount = messages.filter(
    (message) => !message.is_read
  ).length;

  return (
    <section className="admin-messages">
      <div className="admin-messages-heading">
        <div>
          <span className="admin-page-eyebrow">
            INBOX MANAGEMENT
          </span>
          <h1>Messages</h1>
          <p>
            Review messages submitted through your portfolio contact form.
          </p>
        </div>
      </div>

      <div className="admin-messages-stats">
        <div className="admin-messages-stat">
          <span className="admin-messages-stat-icon">
            <FiInbox />
          </span>
          <div>
            <p>Total Messages</p>
            <h3>{messages.length}</h3>
          </div>
        </div>

        <div className="admin-messages-stat">
          <span className="admin-messages-stat-icon">
            <FiMail />
          </span>
          <div>
            <p>Unread Messages</p>
            <h3>{unreadCount}</h3>
          </div>
        </div>
      </div>

      <div className="admin-messages-toolbar">
        <div className="admin-messages-search">
          <FiSearch />
          <input
            type="search"
            placeholder="Search name, email or message..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search messages"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter messages"
        >
          <option value="All">All messages</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
        </select>
      </div>

      {error && (
        <div className="contact-status error" role="alert">
          {error}
          <button type="button" onClick={fetchMessages}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-messages-empty">
          <p>Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="admin-messages-empty">
          <span><FiInbox /></span>
          <h3>
            {messages.length === 0
              ? "No messages yet"
              : "No matching messages"}
          </h3>
          <p>
            {messages.length === 0
              ? "Contact form se submit hone wale messages yahan show honge."
              : "Search ya filter change karke dobara check karein."}
          </p>
          <button type="button" onClick={fetchMessages}>
            Refresh Messages
          </button>
        </div>
      ) : (
        <div className="admin-messages-list">
          {filteredMessages.map((message) => (
            <article
              className={`admin-message-card ${
                message.is_read ? "" : "is-unread"
              }`}
              key={message.id}
            >
              <div className="admin-message-avatar">
                {(message.name || "?").charAt(0).toUpperCase()}
              </div>

              <div className="admin-message-content">
                <div className="admin-message-top">
                  <h3>{message.name}</h3>
                  {!message.is_read && (
                    <span className="admin-message-unread-dot" />
                  )}
                  <time dateTime={message.created_at}>
                    {formatDate(message.created_at)}
                  </time>
                </div>

                <p className="admin-message-email">
                  {message.email}
                </p>

                <p className="admin-message-preview">
                  {message.message}
                </p>

                <div className="admin-message-actions">
                  <button
                    type="button"
                    onClick={() => openMessage(message)}
                  >
                    <FiEye /> View
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      updateReadStatus(message, !message.is_read)
                    }
                  >
                    <FiMail />
                    {message.is_read ? "Mark Unread" : "Mark Read"}
                  </button>

                  <button
                    type="button"
                    className="admin-message-delete"
                    disabled={actionLoading}
                    onClick={() => deleteMessage(message.id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div
          className="admin-message-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <div
            className="admin-message-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
          >
            <div className="admin-message-modal-header">
              <div>
                <span className="admin-page-eyebrow">
                  MESSAGE DETAILS
                </span>
                <h2 id="message-modal-title">
                  Message from {selectedMessage.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message"
              >
                <FiX />
              </button>
            </div>

            <div className="admin-message-modal-body">
              <p>
                <strong>From:</strong> {selectedMessage.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedMessage.email}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {formatDate(selectedMessage.created_at)}
              </p>

              <div className="admin-message-full-text">
                {selectedMessage.message}
              </div>
            </div>

            <div className="admin-message-modal-footer">
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>

              <a href={`mailto:${selectedMessage.email}`}>
                Reply by Email
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminMessages;
