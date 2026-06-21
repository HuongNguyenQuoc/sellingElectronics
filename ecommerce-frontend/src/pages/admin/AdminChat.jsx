  import { useState, useRef, useEffect } from "react";
  import OrderCard from "../../components/OrderCard";

  import api from '../../api/axiosConfig'
  import socket from "../../api/socket";

  // HÀM TẠO MÀU NỀN AVATAR THEO TÊN KHÁCH HÀNG
  const getAvatarColor = (name) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // HÀM LẤY CHỮ CÁI ĐẦU ĐỂ LÀM AVATAR
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const AdminChat = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeUserId, setActiveUserId] = useState(null);
    const [isConnected, setIsConnected] = useState(socket.connected);

    // --- CÁC STATE QUẢN LÝ ---
    const [inputText, setInputText] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // LỖI 4: State phục vụ tính năng tìm kiếm khách hàng
    const messagesEndRef = useRef(null);
    const activeUserIdRef = useRef(activeUserId);
  // --- LỖI 4: LOGIC LỌC DANH SÁCH KHÁCH HÀNG THEO ĐÚNG TÊN GÕ Ở Ô TÌM KIẾM ---
    const filteredConversations = conversations.filter((conversation) =>
      conversation.participantId?.userName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/conversations");

        setConversations(res.data);

        if (res.data.length > 0) {
          setActiveUserId(res.data[0].participantId._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    activeUserIdRef.current = activeUserId;
  }, [activeUserId]);

  // emit message from socket
  const handleIncomingMessage = (message) => {
    setConversations((prev) => {

      return prev.map(cre => {
        if (cre.participantId?._id === message.conversationId) {
          return {
            ...cre,
            lastMessage: message.content || (message.orderData ? '[Đã gửi đơn hàng]' : cre.lastMessage),
            updatedAt: message.createdAt,
          };
        }
        return cre;
      });
    });

    // Nếu tin nhắn thuộc cuộc hội thoại đang mở, thêm vào danh sách hiển thị
    if (message.conversationId === activeUserIdRef.current) {
      setMessages((prev) => [...prev, message]);
    }
  };

  // connect socket
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Admin socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("john_room", { userId: "admin" });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connect error:", error.message);
      setIsConnected(false);
    });

    socket.on("receive_message", (message) => {
      handleIncomingMessage(message);
    });

    socket.on("message_sent", (message) => {
      handleIncomingMessage(message);
    });

    socket.on("message_error", (error) => {
      console.error(error);
    });

    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit("john_room", { userId: "admin" });
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("receive_message");
      socket.off("message_sent");
      socket.off("message_error");
      socket.disconnect();
    };
  }, []);

    useEffect(() => {
      if (!activeUserId) return;

      const fetchMessages = async () => {
        try {
          const res = await api.get(`/messages/${activeUserId}`);
          setMessages(res.data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchMessages();
    }, [activeUserId]);

    // Lọc danh sách tin nhắn hiển thị ở khung chat bên phải
    const activeMessages = messages;

    const activeConversation = conversations.find(
      (conversation) => conversation.participantId?._id === activeUserId
    );

    const activeUser = activeConversation?.participantId;

    // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc đổi người chat
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeUserId, messages]);

    const handleSendMessage = (e) => {
      e.preventDefault();
      if (!inputText.trim() || !activeUserId || !isConnected) return;
      const messagePayload = {
        conversationId: activeUserId,
        senderId: "admin",
        receiverId: activeUserId,
        content: inputText,
      };

      socket.emit("send_message", messagePayload);
      console.log("send_message emitted:", messagePayload);

      setInputText("");
    };

    return (
      <div className="-m-8 h-screen flex bg-white overflow-hidden">
        
        {/* ================= CỘT TRÁI: DANH SÁCH KHÁCH HÀNG ================= */}
        <div className="w-[320px] lg:w-[380px] flex flex-col border-r border-gray-200 bg-gray-50/50 flex-shrink-0">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-800">Tin nhắn</h2>
            <div className="mt-4 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
                </svg>
              </span>
              {/* LỖI 4: Đã kết nối value và onChange để thanh tìm kiếm hoạt động lập tức */}
              <input 
                type="text" 
                placeholder="Tìm kiếm khách hàng..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-gray-800"
              />
            </div>
          </div>

          {/* Render danh sách khách hàng sau khi lọc */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
              const user = conversation.participantId;
              const isActive = user?._id === activeUserId;

                return (
                  <div
                    key={conversation._id}
                    onClick={() => setActiveUserId(user._id)}
                    className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                      isActive ? "bg-yellow-50 border-l-4 border-l-yellow-400" : "hover:bg-gray-100 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0 ${getAvatarColor(user.userName)}`}>
                      {getInitials(user.userName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`font-bold text-sm truncate ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                          {user.userName}
                        </h3>
                        {/* Hiển thị thời gian của tin nhắn cuối */}
                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">
                          {conversation.updatedAt}
                        </span>
                      </div>
                      {/* LỖI 2: Đã thay thế đoạn chữ cứng bằng nội dung tin nhắn cuối cùng thật */}
                      <p className={`text-xs truncate font-medium ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                        {conversation.lastMessage || 'Chưa có cuộc hội thoại'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-sm text-gray-400">
                Không tìm thấy khách hàng nào.
              </div>
            )}
          </div>
        </div>

        {/* ================= CỘT PHẢI: KHUNG CHAT TẬP TRUNG ================= */}
        <div className="flex-1 flex flex-col bg-[#F3F4F6]">
          
          {/* Header người đang chat */}
          {activeUser ? (
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10 h-[73px]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${getAvatarColor(activeUser.userName)}`}>
                  {getInitials(activeUser.userName)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{activeUser.userName}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
                    <span className="text-xs text-gray-500 font-medium">
                      {isConnected ? "Đã kết nối" : "Mất kết nối chat"}
                    </span>
                    <span className="text-xs text-gray-300 mx-1">•</span>
                    <span className="text-xs text-gray-400">{activeUser.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Vui lòng chọn một cuộc hội thoại để bắt đầu nhắn tin.
            </div>
          )}

          {/* Khung nội dung chat */}
          {activeUser && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeMessages.map((msg) => {
                const isAdmin = msg.senderId === "admin";

                return (
                  <div key={msg._id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] ${isAdmin ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      
                      {/* TIN NHẮN VĂN BẢN THƯỜNG */}
                      {msg.content && (
                        <div className={`px-4 py-2.5 rounded-2xl text-[15px] ${
                          isAdmin 
                            ? "bg-yellow-400 text-gray-900 rounded-br-sm shadow-sm font-medium" 
                            : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                        }`}>
                          {msg.content}
                        </div>
                      )}

                      {/* TIN NHẮN ĐƠN HÀNG (ORDER CARD) */}
                      {msg.orderData && (
                        <OrderCard
                          checkoutItems={msg.orderData.checkoutItems}
                          totalAmount={msg.orderData.totalAmount}
                        />
                      )}

                      {/* LỖI 3: Đảm bảo hiển thị mốc thời gian rõ ràng ngay dưới mỗi khối tin nhắn */}
                      <span className="text-[10px] text-gray-400 px-1 mt-0.5">
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Ô nhập câu trả lời */}
          {activeUser && (
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập tin nhắn trả lời..." 
                  className="flex-1 px-5 py-3 bg-gray-100 border-transparent rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-gray-800"
                />
                <button 
                  type="submit" 
                  className={`p-3 rounded-2xl transition-all ${inputText.trim() ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                  disabled={!inputText.trim() || !isConnected}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    );
  };

  export default AdminChat;
