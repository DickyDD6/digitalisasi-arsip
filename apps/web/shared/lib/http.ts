"use client";

import axios from "axios";

export const http = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
