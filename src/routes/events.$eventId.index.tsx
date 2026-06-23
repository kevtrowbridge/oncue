import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/events/$eventId/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/events/$eventId/timeline",
      params: { eventId: params.eventId },
    });
  },
});
