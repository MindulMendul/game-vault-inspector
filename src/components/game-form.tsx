
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Game, ComponentStatus } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const gameSchema = z.object({
  name: z.string().min(1, '게임 이름은 필수 항목입니다'),
  inspected_at: z.string().min(1, '검사 날짜는 필수 항목입니다'),
  inspected_by: z.string().min(1, '검사자 이름은 필수 항목입니다'),
  has_manual: z.boolean(),
  component_status: z.enum(['상', '중', '하'] as const),
  needs_reorder: z.boolean(),
  missing_components: z.string(),
});

interface GameFormProps {
  game?: Game;
  onSubmit: (data: z.infer<typeof gameSchema>) => Promise<void>;
  isLoading?: boolean;
}

const GameForm: React.FC<GameFormProps> = ({
  game,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<z.infer<typeof gameSchema>>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      name: game?.name || '',
      inspected_at: game?.inspected_at 
        ? new Date(game.inspected_at).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      inspected_by: game?.inspected_by || '',
      has_manual: game?.has_manual || false,
      component_status: game?.component_status || '상',
      needs_reorder: game?.needs_reorder || false,
      missing_components: game?.missing_components || '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof gameSchema>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      toast.error('게임 데이터 저장에 실패했습니다');
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{game ? '게임 수정' : '새 게임 추가'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>게임 이름</FormLabel>
                  <FormControl>
                    <Input placeholder="게임 이름 입력" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="inspected_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>검사 날짜</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inspected_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>검사자</FormLabel>
                    <FormControl>
                      <Input placeholder="검사자 이름 입력" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="has_manual"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>규칙서/매뉴얼 보유</FormLabel>
                    <FormDescription>
                      게임에 원본 규칙서가 포함되어 있는 경우 체크하세요
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="component_status"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>구성품 상태</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="상" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          상 (우수) - 모든 구성품이 최상의 상태
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="중" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          중 (양호) - 약간의 마모가 있지만 기능적으로 완전함
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="하" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          하 (불량) - 상당한 마모나 손상이 있음
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="needs_reorder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>구성품 재주문 필요</FormLabel>
                    <FormDescription>
                      교체 구성품을 주문해야 하는 경우 체크하세요
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="missing_components"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>누락된 구성품</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="누락되거나 손상된 구성품 목록"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  저장 중...
                </>
              ) : (
                '게임 저장'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default GameForm;
