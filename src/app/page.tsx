"use client";

import { usePostLogin } from "@/api/login";
import { useMessageGlobal } from "@/utils/message-provider";
import { Form, Input, Button } from "antd";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Login() {
  const [form] = Form.useForm();
  const message = useMessageGlobal();
  const router = useRouter();

  const { mutate: login } = usePostLogin();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const username = Form.useWatch("username", form);
  const password = Form.useWatch("password", form);

  const onSubmit = async () => {
    const values = await form.validateFields();

    login(values, {
      onError: () => {
        message.error("Username atau password salah!");
      },
      onSuccess: (data) => {
        Cookies.set("token", data.token, { expires: 1 });
        router.replace("/dashboard");
        message.success("Login berhasil!");
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center items-center bg-white px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Image src="/assets/logo.png" alt="Logo" width={250} height={100} />
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            className="bg-white"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Silahkan masukkan username" }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Silahkan masukkan password" }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <div className="flex items-center justify-end">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  disabled={!username || !password}
                  size="middle"
                >
                  Login
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-400">
        <Image
          src="/assets/login.jpg"
          alt="Login Illustration"
          width={1000}
          height={1000}
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  );
}
