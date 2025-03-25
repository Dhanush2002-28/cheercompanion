
import React, { useState } from "react";
import { sampleStories } from "../services/api";
import StoryCard from "./StoryCard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const StoriesSection = () => {
  const [stories, setStories] = useState(sampleStories);
  const [selectedEmotion, setSelectedEmotion] = useState("all");

  const emotions = [
    { value: "all", label: "All Emotions ✨" },
    { value: "joy", label: "Joy 😊" },
    { value: "grief", label: "Grief 😢" },
    { value: "anxiety", label: "Anxiety 😰" },
    { value: "hope", label: "Hope 🌟" },
    { value: "gratitude", label: "Gratitude 🙏" },
  ];

  const filteredStories = selectedEmotion === "all"
    ? stories
    : stories.filter(story => story.emotion === selectedEmotion);

  const handleEmotionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEmotion(event.target.value);
  };

  const sortStoriesByLikes = () => {
    const sorted = [...stories].sort((a, b) => b.likes - a.likes);
    setStories(sorted);
  };

  const sortStoriesByRecent = () => {
    const sorted = [...stories].sort((a, b) => b.id - a.id);
    setStories(sorted);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const emotionSelect = form.emotion as HTMLSelectElement;
    
    // Create a new story object
    const newStory = {
      id: stories.length + 1,
      title: (form.title as HTMLInputElement).value,
      content: (form.content as HTMLTextAreaElement).value,
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
          <h2 className="text-3xl font-semibold text-foreground dark:text-white font-playfair">
            Community Stories 📚
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Share Your Story ✏️</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-playfair">Share Your Story ✨</DialogTitle>
                <DialogDescription>
                  Share your emotional experiences and connect with others.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="modal-form">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="title" className="text-right">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="My Story Title"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="content" className="text-right">
                      Content
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      placeholder="Write your story here..."
                      className="col-span-3"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="emotion" className="text-right">
                      Emotion
                    </label>
                    <select
                      id="emotion"
                      name="emotion"
                      className="col-span-3"
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
                <Button type="submit">Submit Story 📝</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between items-center mb-4 reveal">
          <div className="flex items-center space-x-4">
            <select
              value={selectedEmotion}
              onChange={handleEmotionChange}
              className="bg-white dark:bg-gray-700 text-foreground dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-support-500"
            >
              {emotions.map((emotion) => (
                <option key={emotion.value} value={emotion.value}>
                  {emotion.label}
                </option>
              ))}
            </select>
            <button
              onClick={sortStoriesByLikes}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-foreground dark:text-white rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-support-500 transition-colors"
            >
              Sort by Likes ❤️
            </button>
            <button
              onClick={sortStoriesByRecent}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-foreground dark:text-white rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-support-500 transition-colors"
            >
              Sort by Recent 🕒
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
