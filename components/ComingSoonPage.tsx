import React from 'react';
import { VideoIcon } from './icons/VideoIcon';

const videoData = [
    {
        src: 'https://player.vimeo.com/progressive_redirect/playback/908051410/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=5f23585f43a25696142bf3a595a8e6683f23293ded6b50e336b222a27c73b5e4',
        title: 'Dynamic Apparel Showcase',
        description: 'AI-generated models in motion, bringing your apparel to life.',
    },
    {
        src: 'https://player.vimeo.com/progressive_redirect/playback/913387814/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=1a5789f53e6d194519912035a265633b4f53bec524a1251921312386121a8d00',
        title: 'Luxury Accessories Spotlight',
        description: 'Close-ups and cinematic shots that highlight every detail.',
    },
    {
        src: 'https://player.vimeo.com/progressive_redirect/playback/922650779/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=23f9f6057a66b262846f481a510526e036e65a6b0c60523080e4b85750d5e1e2',
        title: 'Cosmetics & Beauty Ads',
        description: 'Create captivating video ads for your beauty products effortlessly.',
    },
];

const VideoCard: React.FC<{ src: string; title: string; description: string; }> = ({ src, title, description }) => (
    <div className="bg-neutral-900/50 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden group h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
            <video
                src={src}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                autoPlay
                loop
                muted
                playsInline
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
        </div>
        <div className="p-6 flex-grow">
            <h4 className="font-semibold text-lg text-white">{title}</h4>
            <p className="mt-2 text-sm text-neutral-400">{description}</p>
        </div>
    </div>
);


export const ComingSoonPage: React.FC = () => {
    
    return (
        <div id="ai-video" className="w-full py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="inline-flex items-center gap-2.5 bg-neutral-800/60 border border-neutral-700 text-sm font-semibold px-4 py-2 rounded-full text-rose-300">
                        <VideoIcon className="w-4 h-4" />
                        COMING SOON
                    </span>
                    <h2 className="mt-6 font-serif-display text-4xl sm:text-5xl font-bold text-white">Revolutionary AI Video Modeling</h2>
                    <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
                        Go beyond static images. Generate stunning, professional-grade product videos with AI models, ready for any marketing channel.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                   {videoData.map((video, index) => (
                       <div key={index} style={{ animationDelay: `${index * 150}ms` }} className="animate-fade-in-up">
                           <VideoCard {...video} />
                       </div>
                   ))}
                </div>
            </div>
        </div>
    );
};