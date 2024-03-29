import axios from "axios";
import { sendStream } from "h3";
export default defineEventHandler(async (event) => {
  const stream = await axios(
    "https://uploads.mangadex.org/covers/d79f3680-8bae-4950-b7c2-30c339156229/9e7f621a-17f4-4027-9ec9-10964478f47a.jpg.256.jpg",
    { responseType: "stream" }
  );
  return sendStream(event, stream.data)
});
