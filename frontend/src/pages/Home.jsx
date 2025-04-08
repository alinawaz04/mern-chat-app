import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Home = () => {
  const { authUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  // Fetch users for the sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/message/${selectedConversation._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: selectedConversation._id,
          message: messageInput,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...messages, data]);
        setMessageInput("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 border-r border-gray-300 flex flex-col">
        {/* User info and logout */}
        <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={authUser.profilePic}
              alt="Avatar"
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <span className="font-medium">{authUser.fullName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-gray-300">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* User list */}
        <div className="overflow-y-auto flex-1">
          {loading && !users.length ? (
            <div className="flex justify-center items-center h-20">
              <span>Loading...</span>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className={`flex items-center p-3 hover:bg-gray-200 cursor-pointer transition ${
                  selectedConversation?._id === user._id ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelectedConversation(user)}
              >
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="w-3/4 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="bg-gray-50 border-b border-gray-300 p-4 flex items-center">
              <img
                src={selectedConversation.profilePic}
                alt={selectedConversation.fullName}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium text-gray-800">
                  {selectedConversation.fullName}
                </h3>
                <p className="text-sm text-gray-600">
                  @{selectedConversation.username}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender === authUser._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === authUser._id
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
              {!messages.length && (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">
                    Send a message to start the conversation!
                  </p>
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-300">
              <form onSubmit={sendMessage} className="flex items-center">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to Chat App</h2>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
