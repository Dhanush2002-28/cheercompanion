
import React, { useState } from "react";
import { sampleStories } from "../services/api";
import StoryCard from "./StoryCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

const StoriesSection = () => {
  const [stories, setStories] = useState(sampleStories);
  const [selectedEmotion, setSelectedEmotion] = useState("all");

  // Emotion options including "all" for filtering
  const emotions = [
    { value: "all", label: "All Emotions" },
    { value: "joy", label: "Joy" },
    { value: "grief", label: "Grief" },
    { value: "anxiety", label: "Anxiety" },
    { value: "hope", label: "Hope" },
    { value: "gratitude", label: "Gratitude" },
  ];

  // Filter stories by emotion
  const filteredStories = selectedEmotion === "all"
    ? stories
    : stories.filter((story) => story.emotion === selectedEmotion);

  // Sort stories by likes (most liked first)
  const sortStoriesByLikes = () => {
    const sorted = [...stories].sort((a, b) => b.likes - a.likes);
    setStories(sorted);
  };

  // Sort stories by recent (newest first, assuming ID is incremental)
  const sortStoriesByRecent = () => {
    const sorted = [...stories].sort((a, b) => b.id - a.id);
    setStories(sorted);
  };

  // Handle form submission to add a new story
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const emotionSelect = form.emotion as HTMLSelectElement;
    
    // Create a new story object
    const newStory = {
      id: stories.length + 1,
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      content: (form.elements.namedItem('content') as HTMLTextAreaElement).value,
      author: "Anonymous",
      emotion: emotionSelect.value,
      likes: 0,
    };
    
    setStories([...stories, newStory]);
    form.reset();
  };

  return (
    <section id="stories" className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 reveal">
          <h2 className="text-3xl font-semibold text-foreground dark:text-gray-100 font-playfair">
            Community Stories 📚
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="dark:text-gray-100 dark:hover:text-white">Share Your Story ✏️</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="font-playfair dark:text-gray-100">Share Your Story ✨</DialogTitle>
                <DialogDescription className="dark:text-gray-300">
                  Share your emotional experiences and connect with others.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Title of your story"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="content"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Your Story
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Share your experience..."
                      required
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="emotion"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Emotion
                    </label>
                    <select
                      id="emotion"
                      name="emotion"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                      defaultValue="joy"
                      required
                    >
                      {emotions.filter(e => e.value !== "all").map((emotion) => (
                        <option key={emotion.value} value={emotion.value}>
                          {emotion.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button type="submit" className="dark:text-white">Submit Story 📝</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter and sort controls */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4 reveal">
          <div className="flex items-center space-x-2">
            <label htmlFor="emotion-filter" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Filter by Emotion:
            </label>
            <select
              id="emotion-filter"
              value={selectedEmotion}
              onChange={(e) => setSelectedEmotion(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
            >
              {emotions.map((emotion) => (
                <option key={emotion.value} value={emotion.value}>
                  {emotion.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={sortStoriesByLikes}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-foreground dark:text-gray-100 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-support-500 transition-colors"
            >
              Sort by Likes ❤️
            </button>
            <button
              onClick={sortStoriesByRecent}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-foreground dark:text-gray-100 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-support-500 transition-colors"
            >
              Sort by Recent 🕒
            </button>
          </div>
        </div>

        {/* Story grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
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
      </div>
    </section>
  );
};

export default StoriesSection;
