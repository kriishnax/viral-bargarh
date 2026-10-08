'use client';
import { useEffect,useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleEditor from '@/app/components/admin/ArticleEditor';
export default function EditArticle(){const {id}=useParams<{id:string}>();const [item,setItem]=useState<any>(null);useEffect(()=>{fetch('/api/articles/'+id).then(r=>r.json()).then(setItem)},[id]);if(!item)return <div className="admin-loading">Loading article…</div>;return <ArticleEditor initial={item}/>}
