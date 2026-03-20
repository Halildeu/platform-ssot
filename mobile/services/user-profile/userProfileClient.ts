import { apiJsonRequest, jsonBody } from "../api/httpClient";
import type { UpdateUserProfileRequest, UserProfileSnapshot } from "./userProfile.contract";

function buildProfileLookupPath() {
  return "/v1/users/me/profile";
}

function buildProfileUpdatePath() {
  return "/v1/users/me/profile";
}

export async function fetchCurrentUserProfile(token: string): Promise<UserProfileSnapshot> {
  return apiJsonRequest<UserProfileSnapshot>(buildProfileLookupPath(), {
    method: "GET",
    token,
  });
}

export async function updateCurrentUserDisplayName(
  token: string,
  request: UpdateUserProfileRequest,
): Promise<UserProfileSnapshot> {
  return apiJsonRequest<UserProfileSnapshot>(buildProfileUpdatePath(), {
    method: "PUT",
    token,
    body: jsonBody({
      name: request.name,
    }),
  });
}
