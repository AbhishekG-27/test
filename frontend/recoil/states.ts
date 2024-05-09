import { atom, selector } from "recoil";

//Define the atom
export const CircleProperties = atom({
  key: "CircleProperties",
  default: {
    color: "#fff",
    strokeWidth: 3,
    opacity: 1,
  },
});

export const RectangleProperties = atom({
  key: "RectangleProperties",
  default: {
    color: "#fff",
    strokeWidth: 3,
    opacity: 1,
  },
});

export const ArrowProperties = atom({
  key: "ArrowProperties",
  default: {
    color: "#fff",
    strokeWidth: 3,
    opacity: 1,
  },
});

export const TextProperties = atom({
  key: "TextProperties",
  default: {
    color: "#fff",
    fontSize: 20,
    fontStyle: "bold",
    fontFamily: "Arial",
    opacity: 1,
  },
});

export const LineProperties = atom({
  key: "LineProperties",
  default: {
    color: "#fff",
    strokeWidth: 3,
    opacity: 1,
  },
});

//Define the selector
export const CirclePropertiesSelector = selector({
  key: "CirclePropertiesSelector",
  get: ({ get }) => {
    return get(CircleProperties);
  },
  set: ({ set }, newValue) => {
    set(CircleProperties, newValue);
  },
});

export const RectanglePropertiesSelector = selector({
  key: "RectanglePropertiesSelector",
  get: ({ get }) => {
    return get(RectangleProperties);
  },
  set: ({ set }, newValue) => {
    set(RectangleProperties, newValue);
  },
});

export const ArrowPropertiesSelector = selector({
  key: "ArrowPropertiesSelector",
  get: ({ get }) => {
    return get(ArrowProperties);
  },
  set: ({ set }, newValue) => {
    set(ArrowProperties, newValue);
  },
});

export const TextPropertiesSelector = selector({
  key: "TextPropertiesSelector",
  get: ({ get }) => {
    return get(TextProperties);
  },
  set: ({ set }, newValue) => {
    set(TextProperties, newValue);
  },
});

export const LinePropertiesSelector = selector({
  key: "LinePropertiesSelector",
  get: ({ get }) => {
    return get(LineProperties);
  },
  set: ({ set }, newValue) => {
    set(LineProperties, newValue);
  },
});
