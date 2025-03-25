
import React, { useState } from "react";
import { Heart } from "lucide-react";

interface StoryCardProps {
  id: number;
  title: string;
  content: string;
  author: string;
  emotion: string;
  likes: number;
}

const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  content,
  emotion,
  author,
  likes,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  // Get emotion color and emoji
  const getEmotionColorAndEmoji = (emotion: string) => {
    const colors: Record<string, { class: string; emoji: string }> = {
      joy: { class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", emoji: "😊" },
      grief: { class: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300", emoji: "😢" },
      anxiety: { class: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", emoji: "😰" },
      hope: { class: "bg-support-100 text-support-800 dark:bg-support-900/30 dark:text-support-300", emoji: "🌟" },
      gratitude: { class: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", emoji: "🙏" },
    };
    return colors[emotion] || { class: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", emoji: "💭" };
  };

  const { class: emotionClass, emoji } = getEmotionColorAndEmoji(emotion);
  const contentPreview = isExpanded
    ? content
    : content.length > 150
    ? `${content.substring(0, 150)}...`
    : content;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-support-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/30">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg dark:text-gray-100">{title}</h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${emotionClass}`}
        >
          {emoji} {emotion}
        </span>
      </div>

      <p className="text-sm text-foreground/90 dark:text-gray-300 mb-4">
        {contentPreview}
        {content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 text-support-600 hover:text-support-700 dark:text-support-400 dark:hover:text-support-300 transition-colors"
          >
            {isExpanded ? "Show less ↑" : "Read more ↓"}
          </button>
        )}
      </p>

      <button
        onClick={handleLike}
        className={`flex items-center gap-1 text-xs rounded-full px-3 py-1 transition-all ${
          isLiked
            ? "bg-support-100 text-support-700 dark:bg-support-900/50 dark:text-support-300"
            : "text-muted-foreground dark:text-gray-400 hover:bg-support-50 dark:hover:bg-gray-700"
        }`}
      >
        <Heart className={`h-3 w-3 ${isLiked ? "fill-support-500 dark:fill-support-400" : ""}`} />
        <span>{likeCount}</span>
      </button>
    </div>
  );
};

export default StoryCard;
