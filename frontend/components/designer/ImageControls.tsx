"use client";

import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";
import {
  cleanPassImagesForPassType,
  getSupportedImagesForPassType,
  type PassImageKey,
  type PassImages,
  type PassType,
} from "@/lib/pass";

const imageLabels: Record<PassImageKey, string> = {
  logo: "Logo",
  icon: "Icon",
  strip: "Strip",
  background: "Background",
  thumbnail: "Thumbnail",
  footer: "Footer",
};

const imageNotes: Partial<Record<PassType, string>> = {
  eventTicketStrip: "Strip image event passes cannot include background or thumbnail images.",
  eventTicketBackground: "Background image event passes cannot include a strip image.",
};

type ImageControlsProps = {
  images?: PassImages;
  onChange?: (images: PassImages | undefined) => void;
  passType: PassType;
};

export function ImageControls({
  images = {},
  onChange,
  passType,
}: ImageControlsProps) {
  const supportedImages = getSupportedImagesForPassType(passType);

  function emitImages(nextImages: PassImages) {
    onChange?.(cleanPassImagesForPassType(passType, nextImages));
  }

  function uploadImage(imageKey: PassImageKey, file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      const nextImages = {
        ...images,
        [imageKey]: reader.result,
      };

      emitImages(nextImages);
    };

    reader.readAsDataURL(file);
  }

  function removeImage(imageKey: PassImageKey) {
    const nextImages = { ...images };
    delete nextImages[imageKey];
    emitImages(nextImages);
  }

  return (
    <div className="image-control-stack">
      {imageNotes[passType] ? (
        <p className="image-control-note">{imageNotes[passType]}</p>
      ) : null}
      <div className="image-control-list">
        {supportedImages.map((imageKey) => {
          const image = images[imageKey];
          const inputId = `${passType}-${imageKey}-image`;

          return (
            <div className="image-control-card" key={imageKey}>
              <div className="image-control-preview">
                {image ? (
                  <Image alt="" fill sizes="48px" src={image} unoptimized />
                ) : (
                  <ImageIcon aria-hidden size={18} />
                )}
              </div>
              <div className="image-control-copy">
                <p className="small-title">{imageLabels[imageKey]}</p>
                <p className="muted-caption">{image ? "Uploaded" : "Empty"}</p>
              </div>
              <label className="image-upload-button" htmlFor={inputId}>
                <Upload aria-hidden size={14} />
                <span>Choose</span>
              </label>
              <input
                accept="image/*"
                className="sr-only"
                disabled={!onChange}
                id={inputId}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";

                  if (file) {
                    uploadImage(imageKey, file);
                  }
                }}
                type="file"
              />
              {image ? (
                <button
                  aria-label={`Remove ${imageLabels[imageKey]} image`}
                  className="image-remove-button"
                  disabled={!onChange}
                  onClick={() => removeImage(imageKey)}
                  type="button"
                >
                  <X aria-hidden size={14} />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
