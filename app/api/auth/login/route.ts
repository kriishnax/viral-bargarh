import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSession, verifyCredentials } from '@/lib/auth';
const schema=z.object({email:z.string().email(),password:z.string().min(1)});
export async function POST(req:Request){try{const body=schema.parse(await req.json());const user=await verifyCredentials(body.email,body.password);if(!user)return NextResponse.json({error:'Invalid email or password'},{status:401});await createSession(user);return NextResponse.json({user})}catch{return NextResponse.json({error:'Invalid request'},{status:400})}}
