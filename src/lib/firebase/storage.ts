import { getDownloadURL, ref, uploadBytesResumable, type UploadTaskSnapshot } from "firebase/storage";
import { storage } from "./config";

/** Resolves a Firebase Storage path (e.g. "courses/abc/lessons/xyz/video") to
 * a fetchable download URL. Pass-through if already an absolute URL, so
 * externally-hosted video/image URLs also work without a code change. */
export async function resolveStorageUrl(pathOrUrl: string): Promise<string> {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return getDownloadURL(ref(storage, pathOrUrl));
}

export function uploadFile(
  path: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        if (onProgress) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/** Builds the canonical storage path for a lesson video, per the convention
 * documented in the README's storage layout section. */
export function lessonVideoPath(courseId: string, lessonId: string, fileName: string) {
  return `courses/${courseId}/lessons/${lessonId}/video/${fileName}`;
}

export function lessonResourcePath(courseId: string, lessonId: string, fileName: string) {
  return `courses/${courseId}/lessons/${lessonId}/resources/${fileName}`;
}

export function courseThumbnailPath(courseId: string, fileName: string) {
  return `courses/${courseId}/thumbnail/${fileName}`;
}

export function galleryImagePath(category: string, fileName: string) {
  return `gallery/${category}/${fileName}`;
}

export function submissionFilePath(userId: string, assignmentId: string, fileName: string) {
  return `submissions/${userId}/${assignmentId}/${fileName}`;
}
