import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sql?: string | null;
  referencedTables?: string[];
  aiGenerated?: boolean;
}

interface AiChatProps {
  onTableSelect: (table: string) => void;
}

export const AiChat = ({ onTableSelect }: AiChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Merhaba! Veritabanı hakkında sorularınızı sorabilirsiniz.\n\nÖrnek sorular:\n- "COMPANY_ID hangi tablolarda var?"\n- "EMPLOYEES tablosu hakkında bilgi"\n- "Kaç tablo var?"\n- "INVOICE ile EMPLOYEES nasıl JOIN edilir?"',
      aiGenerated: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/schema/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        sql: data.sql,
        referencedTables: data.referencedTables,
        aiGenerated: data.aiGenerated,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'API bağlantı hatası. Backend çalışıyor mu?',
        aiGenerated: false,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopySql = (sql: string) => {
    navigator.clipboard.writeText(sql);
  };

  return (
    <div className="se-chat">
      <div className="se-chat__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`se-chat__msg se-chat__msg--${msg.role}`}>
            <div className="se-chat__msg-header">
              <span className="se-chat__msg-role">
                {msg.role === 'user' ? 'Sen' : 'SchemaLens'}
              </span>
              {msg.aiGenerated && (
                <span className="se-badge se-badge--fk" style={{ fontSize: 9 }}>AI</span>
              )}
            </div>
            <div className="se-chat__msg-content" style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
            {msg.sql && (
              <div className="se-chat__sql">
                <div className="se-chat__sql-header">
                  <span>Generated SQL</span>
                  <button className="se-badge" onClick={() => handleCopySql(msg.sql!)}>Copy</button>
                </div>
                <pre>{msg.sql}</pre>
              </div>
            )}
            {msg.referencedTables && msg.referencedTables.length > 0 && (
              <div className="se-chat__refs">
                {msg.referencedTables.map(t => (
                  <button key={t} className="se-badge se-badge--fk" onClick={() => onTableSelect(t)}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="se-chat__msg se-chat__msg--assistant">
            <div className="se-chat__msg-content" style={{ opacity: 0.5 }}>
              Düşünüyor...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="se-chat__input-area">
        <input
          ref={inputRef}
          type="text"
          className="se-chat__input"
          placeholder="Veritabanı hakkında bir soru sorun..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoFocus
        />
        <button
          className="se-chat__send"
          onClick={handleSend}
          disabled={!input.trim() || loading}
        >
          Gönder
        </button>
      </div>
    </div>
  );
};
