import { symbolTypes } from "@/lib/symbols";
import SymbolComponent from "@/components/game/Symbol";
import { useState } from "react";
import InfoModal from "@/components/ui/InfoModal"; // You'll need to create this component
import styles from "@/styles/Home.module.css";
import React from "react";
// Define effect keywords that should be clickable
const EFFECT_KEYWORDS = [
  "Destroys",
  "Adds",
  "Adjacent",
  "Buffed",
  "Buff",
  "Rare",
  "Very Rare",
  "Uncommon",
  "Common",
  "Counter",
  // Add more keywords as needed
];

// Extract parseDescription as a separate component
const ParseDescription: React.FC<{
  description: string;
  symbolSize?: number; // Add optional size prop
}> = ({
  description,
  symbolSize = 20, // Default size if not specified
}) => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState("");

  if (!description) return null;

  // Find all content within square brackets
  const bracketRegex = /\[(.*?)\]/g;
  const parts = description.split(bracketRegex);

  // Even indices are text outside brackets, odd indices are content inside brackets
  const textParts: string[] = [];
  const symbolGroups = [];

  parts.forEach((part, index) => {
    if (index % 2 === 0) {
      // Text outside brackets
      if (part.trim()) {
        textParts.push(part.trim());
      }
    } else {
      // Content inside brackets - these are our symbols
      const symbolContent = part;
      const symbolsInGroup = [];

      // Parse symbols within this bracket group
      const symbolRegex = /<([^>]*)>/g;
      let match;

      while ((match = symbolRegex.exec(symbolContent)) !== null) {
        const symbolId = match[1];
        const symbolType = symbolTypes.find((s) => s.id === symbolId);

        if (symbolType) {
          symbolsInGroup.push({
            symbol: symbolType,
            key: `symbol-${index}-${symbolsInGroup.length}`,
          });
        }
      }

      if (symbolsInGroup.length > 0) {
        symbolGroups.push(symbolsInGroup);
      }
    }
  });

  // Process text parts to find keywords
  const processedTextParts = textParts.map((text, idx) => {
    const result: React.ReactNode[] = [];
    // First split by <br> tags and process each segment
    const segments = text.split(/<br\s*\/?>/gi);
    segments.forEach((segment, segmentIdx) => {
      if (segmentIdx > 0) {
        // Add a line break between segments
        result.push(<br key={`br-${idx}-${segmentIdx}`} />);
      }
      processTextSegment(segment, result, idx * 1000 + segmentIdx * 100);
    });
    return result;
  });

  // Helper function to process text segments and find keywords
  function processTextSegment(
    text: string,
    resultArray: React.ReactNode[],
    startIndex: number
  ): void {
    let lastKeywordIndex = 0;
    let localIndex = startIndex;

    // Create a regex that matches any of the keywords
    const keywordPattern = new RegExp(
      `\\b(${EFFECT_KEYWORDS.join("|")})\\b`,
      "g"
    );
    let keywordMatch;

    while ((keywordMatch = keywordPattern.exec(text)) !== null) {
      // Add text before the keyword
      if (keywordMatch.index > lastKeywordIndex) {
        resultArray.push(text.substring(lastKeywordIndex, keywordMatch.index));
      }

      // Add the clickable keyword
      const keyword = keywordMatch[0];
      resultArray.push(
        <span
          key={localIndex++}
          className="keyword-highlight"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedKeyword(keyword);
            setInfoModalOpen(true);
          }}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "#4a90e2",
          }}
        >
          {keyword}
        </span>
      );

      lastKeywordIndex = keywordPattern.lastIndex;
    }

    // Add remaining text after the last keyword
    if (lastKeywordIndex < text.length) {
      resultArray.push(text.substring(lastKeywordIndex));
    }
  }

  return (
    <>
      <div className={styles.descriptionContainer}>
        {/* Interleave text parts and symbol groups */}
        {processedTextParts.map((textPart, index) => (
          <React.Fragment key={`text-${index}`}>
            <div className={styles.textPart}>{textPart}</div>

            {/* Add symbol group after each text part if available */}
            {symbolGroups[index] && (
              <div className={styles.symbolsRow}>
                {symbolGroups[index].map((item) => (
                  <SymbolComponent
                    key={item.key}
                    symbol={item.symbol}
                    size={symbolSize}
                  />
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Add any remaining symbol groups */}
        {processedTextParts.length <= symbolGroups.length &&
          symbolGroups.slice(processedTextParts.length).map((group, idx) => (
            <div key={`extra-symbols-${idx}`} className={styles.symbolsRow}>
              {group.map((item) => (
                <SymbolComponent
                  key={item.key}
                  symbol={item.symbol}
                  size={symbolSize}
                />
              ))}
            </div>
          ))}
      </div>

      {infoModalOpen && (
        <InfoModal
          effectType={selectedKeyword}
          isOpen={infoModalOpen}
          onClose={() => setInfoModalOpen(false)}
        />
      )}
    </>
  );
};

export default ParseDescription;
