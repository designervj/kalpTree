import { RootState } from '@/store/store';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    component: any;
}

const CommentsModal = ({ isOpen, onClose, component }: Props) => {
    const [commentText, setCommentText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { user } = useSelector((state: RootState) => state.user)
    const componentHtml = component?.html || '';
    const componentCss = component?.css || '';

    // Auto-focus textarea when modal opens
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // Clear text on close
    useEffect(() => {
        if (!isOpen) {
            setCommentText('');
        }
    }, [isOpen]);

    const handleComment = () => {
        if (!commentText.trim()) return;
        console.log('Comment submitted:', commentText, 'for component:', component);
        setCommentText('');
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleComment();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const iframeSrcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              *, *::before, *::after { box-sizing: border-box; }
              html, body {
                margin: 0;
                padding: 8px;
                background: #f8fafc;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 13px;
              }
              ${componentCss}
            </style>
          </head>
          <body>${componentHtml || '<p style="color:#94a3b8;text-align:center;margin-top:16px;">No preview available</p>'}</body>
        </html>
    `;

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9998,
                    background: 'transparent',
                }}
            />

            {/* Comment Box */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    right: '24px',
                    transform: 'translateY(-50%)',
                    zIndex: 9999,
                    width: '360px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 28px rgba(0,0,0,0.16), 0 1.5px 6px rgba(0,0,0,0.08)',
                    border: '1.5px solid #e2e8f0',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    animation: 'commentBoxFadeIn 0.18s ease',
                }}
            >
                {/* ── User row ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '12px',
                            flexShrink: 0,
                            userSelect: 'none' as const,
                        }}
                    >
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                        {user?.name}
                    </span>
                </div>
                {/* ── Component Preview ── */}
                {/* <div>
                    <p style={{
                        margin: '0 0 6px 0',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                    }}>
                        Component Preview
                    </p>
                    <div style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '7px',
                        overflow: 'hidden',
                        background: '#f8fafc',
                    }}>
                        <iframe
                            title="Component Preview"
                            srcDoc={iframeSrcDoc}
                            sandbox="allow-same-origin"
                            scrolling="no"
                            style={{
                                width: '100%',
                                height: '130px',
                                border: 'none',
                                display: 'block',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                </div> */}

                {/* ── Divider ── */}
                <div style={{ height: '1px', background: '#f1f5f9', margin: '0 -16px' }} />


                <textarea
                    ref={textareaRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Comment or add others with @"
                    rows={3}
                    style={{
                        width: '100%',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '9px 12px',
                        fontSize: '13px',
                        color: '#334155',
                        resize: 'vertical',
                        outline: 'none',
                        fontFamily: 'inherit',
                        lineHeight: '1.5',
                        transition: 'border-color 0.15s',
                        boxSizing: 'border-box',
                        background: '#fafbfc',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#fafbfc'; }}
                />

                {/* ── Action buttons ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '6px',
                            border: '1.5px solid #e2e8f0',
                            background: '#f8fafc',
                            color: '#64748b',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget).style.background = '#f1f5f9';
                            (e.currentTarget).style.color = '#1e293b';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget).style.background = '#f8fafc';
                            (e.currentTarget).style.color = '#64748b';
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleComment}
                        disabled={!commentText.trim()}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            background: commentText.trim()
                                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                : '#e2e8f0',
                            color: commentText.trim() ? '#fff' : '#94a3b8',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                            transition: 'all 0.15s',
                            fontFamily: 'inherit',
                            boxShadow: commentText.trim() ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                            if (commentText.trim()) {
                                (e.currentTarget).style.opacity = '0.9';
                                (e.currentTarget).style.transform = 'translateY(-1px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget).style.opacity = '1';
                            (e.currentTarget).style.transform = 'translateY(0)';
                        }}
                    >
                        Comment
                    </button>
                </div>

                {/* ── Hint ── */}
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                    Press{' '}
                    <kbd style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '10px' }}>
                        Ctrl+Enter
                    </kbd>{' '}
                    to submit
                </p>
            </div>

            <style>{`
                @keyframes commentBoxFadeIn {
                    from { opacity: 0; transform: translateY(calc(-50% - 10px)); }
                    to   { opacity: 1; transform: translateY(-50%); }
                }
            `}</style>
        </>
    );
}

export default CommentsModal