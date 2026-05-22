import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

type Msg = { type: "user" | "bot"; text: string; timestamp: Date };

function getSessionKey() {
  let key = localStorage.getItem("quickfix_chat_session");
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("quickfix_chat_session", key);
  }
  return key;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState(getSessionKey);
  const [messages, setMessages] = useState<Msg[]>([
    { type: "bot", text: "Ola! Sou o assistente Quick Fix. Como posso ajudar?", timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.createChatSession(sessionKey).catch(() => {});
  }, [sessionKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || sending) return;
    setInputValue("");
    setMessages((m) => [...m, { type: "user", text, timestamp: new Date() }]);
    setSending(true);
    try {
      const res = await api.sendChatMessage(sessionKey, text);
      setSessionKey(res.sessionKey);
      localStorage.setItem("quickfix_chat_session", res.sessionKey);
      setMessages((m) => [
        ...m,
        { type: "bot", text: res.reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          type: "bot",
          text: "Servidor indisponivel. Tente novamente ou ligue (92) 99999-9999.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <motion.div className="fixed bottom-6 right-6 z-50" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
        <Button onClick={() => setIsOpen(!isOpen)} size="lg" className="rounded-full h-16 w-16 shadow-2xl">
          {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-[min(24rem,calc(100vw-2rem))] z-50"
          >
            <Card className="shadow-2xl border-2">
              <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">QuickFix IA</CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">IA</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          msg.type === "user" ? "bg-primary text-white" : "bg-white dark:bg-gray-800 shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {sending && <p className="text-xs text-muted-foreground animate-pulse">Pensando...</p>}
                  <div ref={bottomRef} />
                </div>
                <div className="p-3 border-t flex gap-2">
                  <Input
                    placeholder="Sua duvida..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={sending}
                  />
                  <Button size="icon" onClick={handleSend} disabled={sending}>
                    <Send className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
