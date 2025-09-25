import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function usePostLogin() {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        payload
      );
      return res.data;
    },
  });
}
