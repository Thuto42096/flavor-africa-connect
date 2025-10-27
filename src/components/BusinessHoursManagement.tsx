import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useBusiness, BusinessHours } from '@/contexts/BusinessContext';
import { toast } from 'sonner';

const BusinessHoursManagement = () => {
  const { business, updateBusinessHours } = useBusiness();
  const [hours, setHours] = useState<BusinessHours[]>(
    business?.hours || [
      { day: 'Monday', open: '10:00', close: '22:00', closed: false },
      { day: 'Tuesday', open: '10:00', close: '22:00', closed: false },
      { day: 'Wednesday', open: '10:00', close: '22:00', closed: false },
      { day: 'Thursday', open: '10:00', close: '22:00', closed: false },
      { day: 'Friday', open: '10:00', close: '23:00', closed: false },
      { day: 'Saturday', open: '10:00', close: '23:00', closed: false },
      { day: 'Sunday', open: '12:00', close: '20:00', closed: false },
    ]
  );

  const handleTimeChange = (index: number, field: 'open' | 'close', value: string) => {
    const updated = [...hours];
    updated[index] = { ...updated[index], [field]: value };
    setHours(updated);
  };

  const handleClosedChange = (index: number, closed: boolean) => {
    const updated = [...hours];
    updated[index] = { ...updated[index], closed };
    setHours(updated);
  };

  const handleSave = () => {
    updateBusinessHours(hours);
    toast.success('Business hours updated! ⏰');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Business Hours</h2>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {hours.map((hour, index) => (
              <div key={hour.day}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{hour.day}</h3>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`closed-${index}`}
                      checked={hour.closed}
                      onCheckedChange={(checked) =>
                        handleClosedChange(index, checked as boolean)
                      }
                    />
                    <Label htmlFor={`closed-${index}`} className="cursor-pointer">
                      Closed
                    </Label>
                  </div>
                </div>

                {!hour.closed && (
                  <div className="grid grid-cols-2 gap-4 ml-4">
                    <div>
                      <Label htmlFor={`open-${index}`} className="text-sm">
                        Opening Time
                      </Label>
                      <Input
                        id={`open-${index}`}
                        type="time"
                        value={hour.open}
                        onChange={(e) =>
                          handleTimeChange(index, 'open', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`close-${index}`} className="text-sm">
                        Closing Time
                      </Label>
                      <Input
                        id={`close-${index}`}
                        type="time"
                        value={hour.close}
                        onChange={(e) =>
                          handleTimeChange(index, 'close', e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {hour.closed && (
                  <p className="text-sm text-muted-foreground ml-4">Closed all day</p>
                )}

                {index < hours.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <Button onClick={handleSave} className="w-full">
            Save Business Hours
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">💡 Tip</h3>
          <p className="text-sm text-muted-foreground">
            Make sure your business hours are accurate so customers know when you're open. You can mark days as closed if you don't operate on those days.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessHoursManagement;

