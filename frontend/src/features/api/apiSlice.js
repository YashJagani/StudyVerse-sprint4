import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:1552/api/v1" }), // ✅ Ensure the correct base URL
    tagTypes: ["Quiz", "Course", "User"],
    endpoints: () => ({}),
});
