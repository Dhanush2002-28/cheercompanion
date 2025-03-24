import React, { useState } from "react";
import { Heart } from "lucide-react";

interface StoryCardProps {
  id: number;
  title: string;
  content: string;
  emotion: string;
  likes: number;
}

const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  content,
  emotion,
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

  // Get emotion color
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: "bg-green-100 text-green-800",
      grief: "bg-indigo-100 text-indigo-800",
      anxiety: "bg-amber-100 text-amber-800",
      hope: "bg-support-100 text-support-800",
      gratitude: "bg-purple-100 text-purple-800",
    };
    return colors[emotion] || "bg-gray-100 text-gray-800";
  };

  const contentPreview = isExpanded
    ? content
    : content.length > 150
    ? `${content.substring(0, 150)}...`
    : content;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-support-100 p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(
            emotion
          )}`}
        >
          {emotion}
        </span>
      </div>

      <p className="text-sm text-foreground/90 mb-4">
        {contentPreview}
        {content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 text-support-600 hover:text-support-700 transition-colors"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      <button
        onClick={handleLike}
        className={`flex items-center gap-1 text-xs rounded-full px-3 py-1 transition-all ${
          isLiked
            ? "bg-support-100 text-support-700"
            : "text-muted-foreground hover:bg-support-50"
        }`}
      >
        <Heart className={`h-3 w-3 ${isLiked ? "fill-support-500" : ""}`} />
        <span>{likeCount}</span>
      </button>
    </div>
  );
};

export default StoryCard;
