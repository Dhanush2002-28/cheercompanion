import React, { useState } from "react";
import { sampleStories } from "../services/api";
import StoryCard from "./StoryCard";
import Modal from "./Modal";

const emotions = [
  { label: "All", value: "all" },
  { label: "Joy", value: "joy" },
  { label: "Grief", value: "grief" },
  { label: "Anxiety", value: "anxiety" },
  { label: "Hope", value: "hope" },
  { label: "Gratitude", value: "gratitude" },
];

const StoriesSection: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stories, setStories] = useState(sampleStories);

  const filteredStories =
    selectedEmotion === "all"
      ? stories
      : stories.filter((story) => story.emotion === selectedEmotion);

  const handleShareExperienceClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newStory = {
      id: stories.length + 1,
      title: form.title.value,
      content: form.content.value,
      author: "Anonymous",
      emotion: form.emotion.value,
      likes: 0,
    };
    setStories([...stories, newStory]);
    setIsModalOpen(false);
  };

  return (
    <section id="stories" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Community Stories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Anonymous experiences from others who've walked similar paths. Find
            connection and perspective in shared human experiences.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 px-2 -mx-2">
          {emotions.map((emotion) => (
            <button
              key={emotion.value}
              onClick={() => setSelectedEmotion(emotion.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedEmotion === emotion.value
                  ? "bg-support-600 text-white"
                  : "bg-white border border-support-200 hover:bg-support-50"
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
            onClick={handleShareExperienceClick}
            className="px-5 py-2 rounded-lg bg-white border border-support-200 hover:bg-support-50 transition-colors shadow-sm"
          >
            Share Your Experience
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-xl mb-4">Share Your Experience</h2>
        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Emotion
            </label>
            <select
              name="emotion"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              {emotions.map((emotion) => (
                <option key={emotion.value} value={emotion.value}>
                  {emotion.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-support-600 text-white rounded-md hover:bg-support-700"
          >
            Submit
          </button>
        </form>
      </Modal>
    </section>
  );
};

export default StoriesSection;
