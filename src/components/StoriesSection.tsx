
import React, { useState } from 'react';
import { sampleStories } from '../services/api';
import StoryCard from './StoryCard';

const emotions = [
  { label: 'All', value: 'all' },
  { label: 'Joy', value: 'joy' },
  { label: 'Grief', value: 'grief' },
  { label: 'Anxiety', value: 'anxiety' },
  { label: 'Hope', value: 'hope' },
  { label: 'Gratitude', value: 'gratitude' },
];

const StoriesSection: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState('all');

  const filteredStories = selectedEmotion === 'all'
    ? sampleStories
    : sampleStories.filter(story => story.emotion === selectedEmotion);

  return (
    <section id="stories" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Community Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Anonymous experiences from others who've walked similar paths. 
            Find connection and perspective in shared human experiences.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 px-2 -mx-2">
          {emotions.map((emotion) => (
            <button
              key={emotion.value}
              onClick={() => setSelectedEmotion(emotion.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedEmotion === emotion.value
                  ? 'bg-support-600 text-white'
                  : 'bg-white border border-support-200 hover:bg-support-50'
              }`}
            >
              {emotion.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              content={story.content}
              author={story.author}
              emotion={story.emotion}
              likes={story.likes}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Would you like to anonymously share your story?
          </p>
          <button 
            className="px-5 py-2 rounded-lg bg-white border border-support-200 hover:bg-support-50 transition-colors shadow-sm"
          >
            Share Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
