
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
  name: z.string().min(1, 'Game name is required'),
  inspected_at: z.string().min(1, 'Inspection date is required'),
  inspected_by: z.string().min(1, 'Inspector name is required'),
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
      toast.error('Failed to save game data');
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{game ? 'Edit Game' : 'Add New Game'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter game name" {...field} />
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
                    <FormLabel>Inspection Date</FormLabel>
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
                    <FormLabel>Inspected By</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter inspector's name" {...field} />
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
                    <FormLabel>Has Rulebook/Manual</FormLabel>
                    <FormDescription>
                      Check if the game includes its original rulebook
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
                  <FormLabel>Component Status</FormLabel>
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
                          상 (Good) - All components in excellent condition
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="중" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          중 (Fair) - Some wear but functionally complete
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="하" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          하 (Poor) - Significant wear or damage
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
                    <FormLabel>Needs Component Reorder</FormLabel>
                    <FormDescription>
                      Check if replacement components need to be ordered
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
                  <FormLabel>Missing Components</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any missing or damaged components"
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
                  Saving...
                </>
              ) : (
                'Save Game'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default GameForm;
