"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CalenderPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate") {
      setStartDate(value);
    }

    if (name === "endDate") {
      setEndDate(value);
    }
  };

  const dates = [
    { date: "13 Nov, 2019", day: "Nov 13, Wed", avl: 10, status: "available" },
    { date: "14 Nov, 2019", day: "Nov 14, Thu", avl: 5, status: "available" },
    { date: "15 Nov, 2019", day: "Nov 15, Fri", avl: 3, status: "limited" },
    { date: "16 Nov, 2019", day: "Nov 16, Sat", avl: 2, status: "limited" },
    { date: "17 Nov, 2019", day: "Nov 17, Sun", avl: 0, status: "unavailable" },
    { date: "18 Nov, 2019", day: "Nov 18, Mon", avl: 10, status: "available" },
    { date: "19 Nov, 2019", day: "Nov 19, Tue", avl: 13, status: "available" },
    { date: "20 Nov, 2019", day: "Nov 20, Wed", avl: 7, status: "available" },
    { date: "21 Nov, 2019", day: "Nov 21, Thu", avl: 1, status: "limited" },
    { date: "22 Nov, 2019", day: "Nov 22, Fri", avl: 10, status: "available" },
    { date: "23 Nov, 2019", day: "Nov 23, Sat", avl: 11, status: "available" },
    { date: "13 Nov, 2019", day: "Nov 13, Wed", avl: 10, status: "available" },
    { date: "14 Nov, 2019", day: "Nov 14, Thu", avl: 5, status: "available" },
    { date: "15 Nov, 2019", day: "Nov 15, Fri", avl: 3, status: "limited" },
    { date: "16 Nov, 2019", day: "Nov 16, Sat", avl: 2, status: "limited" },
    { date: "17 Nov, 2019", day: "Nov 17, Sun", avl: 0, status: "unavailable" },
    { date: "18 Nov, 2019", day: "Nov 18, Mon", avl: 10, status: "available" },
    { date: "19 Nov, 2019", day: "Nov 19, Tue", avl: 13, status: "available" },
    { date: "20 Nov, 2019", day: "Nov 20, Wed", avl: 7, status: "available" },
    { date: "21 Nov, 2019", day: "Nov 21, Thu", avl: 1, status: "limited" },
    { date: "22 Nov, 2019", day: "Nov 22, Fri", avl: 10, status: "available" },
    { date: "23 Nov, 2019", day: "Nov 23, Sat", avl: 11, status: "available" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="border-2 p-2 border-gray-500 rounded-lg">
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              className="focus:outline-none"
            />
          </div>

          <div className="border-2 p-2 border-gray-500 rounded-lg">
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              className="focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-5">
          <Button variant={"outline"}>Export</Button>

          <div className="flex gap-1">
            <Button>Previous</Button>
            <Button>Next</Button>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="border-2 w-[300px] px-8 py-4 ">Name of the Product</div>
        <div className="flex-1 h-15 flex justify-between no-wrap">
          {dates.map((d) => {
            return (
              <span className="border-2 w-20 flex-1 flex-none">{d.date}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
