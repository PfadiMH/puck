"use client";
import { getFile } from "@lib/db/asb/database";
import { useEffect, useState } from "react";
export type TextProps = {
  text: string[];
};

export function Textin({ text }: TextProps) {
  return (
    <>
      {text &&
        text.map((singleText, index) => (
          <DownloadButton key={index} text={singleText} />
        ))}
    </>
  );
}

function DownloadButton({ text }: { text: string }) {
  const [url, setUrl] = useState<string | null>(null);

  const getFileUrl = async () => {
    const fileURL = await getFile(text);
    setUrl(fileURL);
  };
  useEffect(() => {
    getFileUrl();
  }, [text]);

  return (
    <>
      {url && (
        <a href={url} download={text}>
          Download {text}
        </a>
      )}
    </>
  );
}
