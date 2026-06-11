import { io } from "socket.io-client";

import { useState, useEffect } from "react";
import { dummyMessages } from "../data/mockData"; // Import dữ liệu từ mockData
import OrderCard from "./OrderCard"; // Đảm bảo đường dẫn này đúng với nơi bạn lưu OrderCard
import api from '../../api/axiosConfig'

const socket = io("http://localhost:3000");

const ChatWidget = async() => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const [inputMessage, setInputMessage] = useState("");
  const currentUser = JSON.parse(
        localStorage.getItem("user")
      );

  const res = await api.get(`/messages/${currentUser._id}`);
  setMessages(res.data);


  // Lắng nghe sự kiện 'toggleChat' từ bất cứ đâu
  useEffect(() => {
    if (!currentUser) return;

    socket.emit("john_room", {
      userId: currentUser._id
    });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("message_sent", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("message_error", (error) => {
      console.error(error);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
      socket.off("message_error");
    };
  }, []);

  //send message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    if (!currentUser) return;

    const messagePayload = {
      senderId: currentUser._id,
      receiverId: "admin",
      content: inputMessage
    };

    socket.emit("send_message", messagePayload);

    setInputMessage("");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-0 right-6 w-[340px] bg-white rounded-t-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 z-50 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gray-900 px-4 py-3 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center font-black text-gray-900 text-lg shadow-inner">
                  TV
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[15px] text-white leading-tight">TechVolt Support</span>
                <span className="text-[11px] text-gray-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                  Đang hoạt động
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-gray-800 rounded-full transition-colors text-gray-300 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body Chat */}
          <div className="h-80 p-4 bg-gray-50 overflow-y-auto flex flex-col gap-4">
            <div className="text-center text-[11px] font-medium text-gray-400 my-1 bg-white inline-block mx-auto px-3 py-1 rounded-full shadow-sm">
              Hôm nay, 10:45 AM
            </div>

            {/* DÙNG VÒNG LẶP ĐỂ VẼ TOÀN BỘ TIN NHẮN TỪ MOCK DATA */}
            {messages.map((msg) => {
              const isAdmin = msg.senderId === "admin";

              return (
                <div key={msg._id} className={`flex gap-2 ${isAdmin ? "items-end" : "justify-end mt-1"}`}>
                  
                  {/* Avatar Admin (Chỉ hiển thị nếu là admin gửi) */}
                  {isAdmin && (
                    <div className="w-7 h-7 bg-yellow-400 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black text-gray-900 shadow-sm">
                      TV
                    </div>
                  )}

                  <div className={`max-w-[85%] ${!isAdmin ? "bg-gray-900 text-white p-3 rounded-2xl rounded-br-sm shadow-md text-[14px]" : ""}`}>
                    
                    {/* TRƯỜNG HỢP 1: TIN NHẮN CHỮ */}
                    {msg.content && isAdmin && (
                      <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-sm text-[14px] text-gray-800 shadow-sm">
                        {msg.content}
                      </div>
                    )}
                    {msg.content && !isAdmin && (
                      <span>{msg.content}</span>
                    )}

                    {/* TRƯỜNG HỢP 2: TIN NHẮN ĐƠN HÀNG */}
                    {msg.orderData && (
                      <OrderCard 
                        checkoutItems={msg.orderData.checkoutItems} 
                        totalAmount={msg.orderData.totalAmount} 
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer (Khung nhập) */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center border border-transparent focus-within:border-yellow-400 focus-within:bg-white transition-all">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="bg-transparent flex-1 focus:outline-none text-[14px] text-gray-700"
              />
            </div>
            <button 
              onClick={handleSendMessage}
              className="w-9 h-9 flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full transition-transform hover:scale-110 shadow-sm shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Nút Bấm Nổi */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(234,179,8,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2.5 z-50 overflow-hidden"
        >
          <div className="relative flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border-2 border-yellow-400"></span>
            </span>
          </div>
          <span className="font-bold text-[15px] whitespace-nowrap">Hỗ trợ</span>
        </button>
      )}
    </>
  );
};

export default ChatWidget;