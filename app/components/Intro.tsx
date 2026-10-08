'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, ArrowDown, X } from 'lucide-react';

export default function Intro({ locale }: { locale: 'en' | 'or' }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (!sessionStorage.getItem('vb-intro-seen')) setVisible(true); }, []);
  if (!visible) return null;
  const enter = () => { sessionStorage.setItem('vb-intro-seen', '1'); setEntered(true); setTimeout(() => setVisible(false), 650); };
  const toggleSound = () => { const next = !muted; setMuted(next); if (videoRef.current) videoRef.current.muted = next; };
  const odia = locale === 'or';
  return <section className={`intro ${entered ? 'intro--exit' : ''}`}>
    <video ref={videoRef} className="intro__video" autoPlay muted playsInline poster="/video/intro-poster.jpg" onEnded={enter} preload="metadata"><source src="/video/viral-bargarh-intro.mp4" type="video/mp4" /></video>
    <div className="intro__veil" /><div className="intro__grain" />
    <div className="intro__topbar"><span className="intro__live"><i /> BARGARH • ODISHA</span><div className="intro__controls"><button className="intro-icon" onClick={toggleSound}>{muted ? <VolumeX size={17}/> : <Volume2 size={17}/>}</button><button className="intro-skip" onClick={enter}><X size={15}/> {odia ? 'ସ୍କିପ୍' : 'Skip intro'}</button></div></div>
    <div className="intro__content"><img className="intro__logo" src="/brand/logo.jpg" alt="Viral Bargarh" /><p className="intro__eyebrow">FAST • LOCAL • VERIFIED</p><h1><span>VIRAL</span> BARGARH</h1><p className="intro__tagline">{odia ? 'ବରଗଡ଼ର ସ୍ୱର। ଖବର ପରେ ମଧ୍ୟ।' : "Bargarh's voice. Beyond the headlines."}</p><button className="enter-button" onClick={enter}>{odia ? 'ୱେବସାଇଟ୍ ପ୍ରବେଶ' : 'ENTER WEBSITE'} <ArrowDown size={16}/></button></div>
    <div className="intro__footer"><span>ଓଡ଼ିଆ</span><span>English</span><span>News • Stories • Voices</span></div>
  </section>;
}
