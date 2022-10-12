import React from "react";
import { BoundsStatic, RangeStatic } from "quill";
import { Menu, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

export const SuggestionsDropdown: React.FC<{
  text: string;
  range: RangeStatic;
  bounds: BoundsStatic;
  items: { suggestion: string }[];
  onSelectSuggestion: (suggestion: string, range: RangeStatic) => void;
  onAddToDictionary: (text: string) => void;
  onIgnore: (range: RangeStatic) => void;
}> = ({
  text,
  range,
  bounds: { left, top },
  items,
  onSelectSuggestion,
  onAddToDictionary,
  onIgnore,
}) => (
  <div
    style={{
      position: "absolute",
      left: left - 12,
      top: top + 30,
    }}
  >
    <Menu isOpen>
      {() => (
        <>
          <MenuList>
            {items.map(({ suggestion }) => (
              <MenuItem
                key={suggestion}
                onClick={() => onSelectSuggestion(suggestion, range)}
              >
                {suggestion}
              </MenuItem>
            ))}
            <MenuDivider />
            <MenuItem
              icon={<AddIcon />}
              onClick={() => onAddToDictionary(text)}
            >
              Add to Dictionary
            </MenuItem>
            <MenuItem icon={<CloseIcon />} onClick={() => onIgnore(range)}>
              Ignore
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  </div>
);
