import React from 'react';

const modelImages = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

const Tooltip: React.FC = () => (
    <div className="w-56 bg-neutral-800/80 backdrop-blur-lg border border-neutral-600/50 rounded-lg shadow-2xl p-4 text-center animate-pop-in">
        <h4 className="font-bold text-white text-md">Choose Your Perfect Model</h4>
        <p className="text-neutral-300 text-sm mt-1">60+ diverse options and counting...</p>
        <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-4 h-4 bg-neutral-800/80 border-b border-r border-neutral-600/50 rotate-45" />
    </div>
);

export const AIModelsGrid: React.FC = () => {
    const staticIndex = 2; // The model to highlight (3rd model, center of top row)

    return (
        <div className="relative">
            <h3 className="font-medium text-neutral-300 text-center mb-4 text-lg">Endless diversity of AI models</h3>
            <div className="relative grid grid-cols-5 gap-3 md:gap-4">
                {modelImages.map((src, index) => (
                    <div
                        key={index}
                        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-lg border-2 transition-all duration-500 animate-fade-in ${
                            index === staticIndex ? 'border-rose-500 scale-110' : 'border-neutral-700'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <img
                            src={src}
                            alt={`AI Model ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}

                 <div
                    className="absolute z-10 top-[-70px] left-1/2 -translate-x-1/2 md:top-[-75px]"
                >
                    <Tooltip />
                </div>
            </div>
        </div>
    );
};
