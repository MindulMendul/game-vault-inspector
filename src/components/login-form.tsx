
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요' }),
  password: z.string().min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다' }),
});

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@example.com', // Pre-filled for demo
      password: 'password', // Pre-filled for demo
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>
          보드 게임 재고 관리 시스템에 접속하기 위해 로그인하세요
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="admin@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="******" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      <CardFooter className="flex-col space-y-2 border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <strong>데모 계정 정보:</strong><br/>
          이메일: admin@example.com<br/>
          비밀번호: password
        </div>
        <div className="text-xs text-muted-foreground">
          참고: Supabase 인증 통합 전까지의 임시 로그인 방식입니다
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
