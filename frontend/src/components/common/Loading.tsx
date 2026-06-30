export default function Loading({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent', opacity: 0.4 }} />
      <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>{text}</p>
    </div>
  )
}
