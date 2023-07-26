import React from "react";
import { SortOrderVal } from "~/utils/enums";

type SortPostBarProps = {
  order: SortOrderVal;
  setOrder: (order: SortOrderVal) => void;
};

export const SortPostBar = ({ order, setOrder }: SortPostBarProps) => {
  return (
    <div className="flex flex-col px-2">
      <select
        id="sort-options"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-md font-semibold  text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      >
        <option
          selected={order === SortOrderVal.LIKES_DESC}
          onClick={() => {
            setOrder(SortOrderVal.LIKES_DESC);
          }}
        >
          Least Liked First
        </option>
        <option
          selected={order === SortOrderVal.LIKES_ASC}
          onClick={() => {
            setOrder(SortOrderVal.LIKES_ASC);
          }}
        >
          Most Liked First
        </option>
        <option
          selected={order === SortOrderVal.CREATED_DESC}
          onClick={() => {
            setOrder(SortOrderVal.CREATED_DESC);
          }}
        >
          Oldest First
        </option>
        <option
          selected={order === SortOrderVal.CREATED_ASC}
          onClick={() => {
            setOrder(SortOrderVal.CREATED_ASC);
          }}
        >
          Newest First
        </option>
      </select>
    </div>
  );

  return (
    <div className="flex flex-row space-x-2">
      <button
        onClick={() => {
          setOrder(SortOrderVal.LIKES_DESC);
        }}
        className={`rounded bg-slate-500 p-2 text-lg font-semibold ${
          order === SortOrderVal.LIKES_DESC ? "bg-slate-700" : ""
        }`}
      >
        Least Liked First
      </button>
      <button
        onClick={() => {
          setOrder(SortOrderVal.LIKES_ASC);
        }}
        className={`rounded bg-slate-500 p-2 text-lg font-semibold ${
          order === SortOrderVal.LIKES_ASC ? "bg-slate-700" : ""
        }`}
      >
        Most Liked First
      </button>
      <button
        onClick={() => {
          setOrder(SortOrderVal.CREATED_DESC);
        }}
        className={`rounded bg-slate-500 p-2 text-lg font-semibold ${
          order === SortOrderVal.CREATED_DESC ? "bg-slate-700" : ""
        }`}
      >
        Oldest First
      </button>
      <button
        onClick={() => {
          setOrder(SortOrderVal.CREATED_ASC);
        }}
        className={`rounded bg-slate-500 p-2 text-lg font-semibold ${
          order === SortOrderVal.CREATED_ASC ? "bg-slate-700" : ""
        }`}
      >
        Newest First
      </button>
    </div>
  );
};
