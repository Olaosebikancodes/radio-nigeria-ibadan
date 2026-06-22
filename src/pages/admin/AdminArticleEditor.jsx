import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layout/AdminLayout'
import { slugify, CATEGORIES } from '../../lib/utils'
import toast from 'react-hot-toast'

const selectStyle = { width:'100%', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text)', outline:'none', fontFamily:'var(--font-body)' }
const inputStyle  = { ...selectStyle }

export default function AdminArticleEditor() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isNew    = !id

  const [form, setForm]       = useState({ title:'', excerpt:'', category:'general', station_id:'', cover_image:'', published:false })
  const [stations, setStations] = useState([])
  const [saving, setSaving]   = useState(false)
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick:false })],
    content: '',
    editorProps: { attributes: { class:'tiptap-editor' } },
  })

  useEffect(() => {
    supabase.from('stations').select('id,name').eq('active',true).order('sort_order').then(({ data }) => setStations(data||[]))
    if (!isNew) {
      supabase.from('articles').select('*').eq('id',id).single().then(({ data }) => {
        if (data) {
          setForm({ title:data.title, excerpt:data.excerpt||'', category:data.category||'general', station_id:data.station_id||'', cover_image:data.cover_image||'', published:data.published })
          editor?.commands.setContent(data.content||'')
        }
      })
    }
  }, [id, editor])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `covers/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert:true })
    if (error) { toast.error('Upload failed'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
    setForm(f => ({ ...f, cover_image: publicUrl }))
    setUploading(false); toast.success('Image uploaded')
  }

  const save = async (publish=null) => {
    if (!form.title.trim()) { toast.error('Title required'); return }
    setSaving(true)
    const slug    = slugify(form.title)
    const content = editor?.getHTML() || ''
    const payload = {
      ...form, slug, content,
      station_id: form.station_id || null,
      published:  publish !== null ? publish : form.published,
      published_at: (publish !== null ? publish : form.published) ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }
    const { error } = isNew
      ? await supabase.from('articles').insert(payload)
      : await supabase.from('articles').update(payload).eq('id',id)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(isNew ? 'Article created' : 'Article saved')
    navigate('/admin/news')
  }

  return (
    <AdminLayout>
      <div style={{ padding:'32px', maxWidth:'900px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>{isNew ? 'New Article' : 'Edit Article'}</h1>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={()=>save(false)} disabled={saving} style={{ padding:'9px 18px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-surface-2)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)' }}>Save Draft</button>
            <button onClick={()=>save(true)} disabled={saving} style={{ padding:'9px 18px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none' }}>{saving ? 'Saving…' : 'Publish'}</button>
          </div>
        </div>

        <div className="editor-grid" style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'24px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Title *</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Article title…" style={{ ...inputStyle, fontSize:'18px', fontFamily:'var(--font-display)', fontWeight:700 }} />
            </div>
            <div>
              <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Excerpt</label>
              <textarea value={form.excerpt} onChange={e=>setForm(f=>({...f,excerpt:e.target.value}))} rows={2} placeholder="Brief summary…" style={{ ...inputStyle, resize:'vertical' }} />
            </div>

            <div>
              <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Content</label>
              <div style={{ display:'flex', gap:'4px', flexWrap:'wrap', padding:'8px', background:'var(--color-surface-2)', borderRadius:'10px 10px 0 0', border:'1px solid var(--color-border)', borderBottom:'none' }}>
                {[
                  { label:'B',    action:()=>editor?.chain().focus().toggleBold().run() },
                  { label:'I',    action:()=>editor?.chain().focus().toggleItalic().run() },
                  { label:'H2',   action:()=>editor?.chain().focus().toggleHeading({level:2}).run() },
                  { label:'H3',   action:()=>editor?.chain().focus().toggleHeading({level:3}).run() },
                  { label:'UL',   action:()=>editor?.chain().focus().toggleBulletList().run() },
                  { label:'OL',   action:()=>editor?.chain().focus().toggleOrderedList().run() },
                  { label:'" "',  action:()=>editor?.chain().focus().toggleBlockquote().run() },
                  { label:'"”',    action:()=>editor?.chain().focus().setHorizontalRule().run() },
                ].map(btn=>(
                  <button key={btn.label} onClick={btn.action} style={{ padding:'4px 10px', borderRadius:'6px', fontSize:'12px', fontWeight:600, cursor:'pointer', background:'var(--color-surface)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)' }}>{btn.label}</button>
                ))}
              </div>
              <div style={{ background:'var(--color-surface-2)', border:'1px solid var(--color-border)', borderRadius:'0 0 10px 10px', minHeight:'300px', padding:'16px' }}>
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div style={{ background:'var(--color-surface)', borderRadius:'12px', border:'1px solid var(--color-border)', padding:'16px', display:'flex', flexDirection:'column', gap:'14px' }}>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Category</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={selectStyle}>
                  {CATEGORIES.filter(c=>c.value!=='all').map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Station</label>
                <select value={form.station_id} onChange={e=>setForm(f=>({...f,station_id:e.target.value}))} style={selectStyle}>
                  <option value="">No station</option>
                  {stations.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Cover Image</label>
                {form.cover_image && <img src={form.cover_image} alt="Cover" style={{ width:'100%', height:'100px', objectFit:'cover', borderRadius:'8px', marginBottom:'8px' }} />}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize:'12px', color:'var(--color-text-muted)', width:'100%' }} />
                {uploading && <p style={{ fontSize:'11px', color:'var(--color-text-dim)', marginTop:'4px' }}>Uploading…</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .editor-grid { grid-template-columns: 1fr !important; } }
        .tiptap-editor { min-height:260px; color:var(--color-text); font-size:15px; line-height:1.75; outline:none; }
        .tiptap-editor h2 { font-family:var(--font-display); font-size:22px; color:var(--color-text); margin:20px 0 10px; }
        .tiptap-editor h3 { font-family:var(--font-display); font-size:18px; color:var(--color-text); margin:16px 0 8px; }
        .tiptap-editor p { margin-bottom:12px; color:var(--color-text-muted); }
        .tiptap-editor ul, .tiptap-editor ol { padding-left:20px; margin-bottom:12px; color:var(--color-text-muted); }
        .tiptap-editor blockquote { border-left:3px solid var(--color-brand); padding-left:16px; color:var(--color-text-dim); font-style:italic; margin:16px 0; }
        .tiptap-editor strong { color:var(--color-text); }
        .tiptap-editor p.is-editor-empty:first-child::before { content:attr(data-placeholder); float:left; color:var(--color-text-dim); pointer-events:none; height:0; }
      `}</style>
    </AdminLayout>
  )
}
