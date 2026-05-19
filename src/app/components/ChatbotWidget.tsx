import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Olá! Sou o QuickFix Bot 🤖. Como posso ajudar você hoje?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: 'Obrigado pela sua mensagem! Nossa equipe irá analisar e responder em breve. Para atendimento imediato, utilize nosso número: (11) 9999-9999',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInputValue('');
  };

  return (
    <>
      {/* Botão flutuante */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full h-16 w-16 shadow-2xl relative"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="size-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <MessageCircle className="size-6" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
          </span>
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 z-50"
          >
            <Card className="shadow-2xl border-2">
              <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
                      🤖
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">QuickFix Bot</CardTitle>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span>Online agora</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    IA
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-gray-800 shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white dark:bg-gray-800">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                    />
                    <Button onClick={handleSend} size="icon">
                      <Send className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
