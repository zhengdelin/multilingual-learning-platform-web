<template>
  <div class="words-container">
    <div class="words">
      <DictTextParser :text="text">
        <template #all="{ textList }">
          <ruby v-for="groupData in getWordGroups(textList)" :key="text" :class="['word-group']">
            <DictSearchableText :text="groupData.text">
              <ruby v-for="item in groupData.groups" :key="text" :class="['word', { 'has-zhuyin': !!item.zhuyin }]">
                {{ item.text
                }}<rt
                  class="zhuyin-container"
                  v-if="item.zhuyin"
                  :data-zhuyin-length="item.zhuyin.zhuyin.length"
                  :data-tone="item.zhuyin.tone"
                >
                  <span class="zhuyin">{{ item.zhuyin.zhuyin }}</span>
                  <span class="tone" :style="{ visibility: item.zhuyin.tone ? 'visible' : 'hidden' }">{{
                    item.zhuyin.tone || "ˊ"
                  }}</span>
                </rt>
              </ruby>
            </DictSearchableText>
          </ruby>
        </template>
      </DictTextParser>
    </div>
    <div
      v-if="parsedPinyin.parsedPinyinList.length"
      class="pinyin-container"
      :style="{ '--grid-areas': parsedPinyin.gridArea }"
    >
      <div
        v-for="pinyin in parsedPinyin.parsedPinyinList"
        :key="pinyin.text"
        class="pinyin"
        :style="{ '--grid-area': pinyin.gridArea }"
      >
        {{ pinyin.text }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type ParsedZhuyin = {
  zhuyin: string;
  tone: string;
} | null;

const props = withDefaults(
  defineProps<{
    text: string;
    zhuyin?: string;
    pinyin?: string;
  }>(),
  {},
);

const zhuyin = computed(() => {
  return props.zhuyin?.split("(`變~)")[0] || "";
});
const pinyin = computed(() => props.pinyin?.split("(`變~)")[0] || "");
const toneRegex = /[\u02C7\u02CA\u02CB\u02D9]/;
function splitZhuyin(text?: string) {
  if (!text) return [];

  const zhuyinRegex = /[\u02C7\u02CA\u02CB\u02D9]?[\u3100-\u312F]+[\u02C7\u02CA\u02CB\u02D9]?/g;
  return text.match(zhuyinRegex) || [];
}

function parseZhuyin(text?: string): ParsedZhuyin {
  if (!text) return null;

  // 將注音符號和聲調分組
  const tone = text.match(toneRegex)?.[0] || "";
  const zhuyin = text.replace(toneRegex, "");

  return {
    zhuyin,
    tone,
  };
}

function splitPinyin(text?: string) {
  if (!text) return [];
  const matches = text.trim().replace(/[,.]/g, " ").split(" ");
  return matches;
}

const splittedZhuyin = computed(() => splitZhuyin(zhuyin.value));
const splittedPinyin = computed(() => splitPinyin(pinyin.value));
function parsePinyinToGridArea(text?: string) {
  if (!text) return { gridArea: "", parsedPinyinList: [] };
  const gridAreaList = [];
  const parsedPinyinList = [];
  for (let i = 0; i < splittedPinyin.value.length; i++) {
    const pinyin = splittedPinyin.value[i];
    const count = pinyin.split("-").length;
    const gridArea = `a${i}`;
    gridAreaList.push(...Array(count).fill(gridArea));
    parsedPinyinList.push({
      text: pinyin,
      gridArea: `"${gridArea}"`,
    });
  }

  return {
    gridArea: `"${new Array(gridAreaList.length).fill("a").join(" ")}"
    "${gridAreaList.join(" ")}"`,
    parsedPinyinList,
  };
}
const parsedPinyin = computed(() => parsePinyinToGridArea(props.pinyin));
function getWordGroups(textList: any[]) {
  const groups = [] as { text: string; groups: { text: string; zhuyin: ParsedZhuyin }[] }[];
  let i = 0;
  for (const words of textList) {
    if (words.type === "punctuation") {
      groups.push({
        text: words.text,
        groups: [
          {
            text: words.text,
            zhuyin: null,
          },
        ],
      });
      i++;
    } else {
      groups.push({
        text: words.text,
        groups: words.text.split("").map((text: string) => ({
          text: text,
          zhuyin: parseZhuyin(splittedZhuyin.value[i++]),
        })),
      });
    }
  }
  return groups;
}
</script>
<style scoped lang="scss">
.words-container {
  display: flex;
  flex-direction: column;

  .word-group {
    font-size: 40px;
    line-height: normal;
    ~ .word-group {
      margin-left: 4px;
    }
    position: relative;
    // &.has-pinyin {
    //   --pinyin-size: 0.375em;
    //   padding-bottom: var(--pinyin-size);
    //   &::before {
    //     --size: var(--pinyin-size);
    //     position: absolute;
    //     content: attr(data-pinyin);
    //     bottom: calc(-1 * var(--size));
    //     font-size: var(--size);
    //     font-style: italic;
    //     left: 50%;
    //     transform: translateX(-50%);
    //     color: #666;
    //   }
    // }

    .word {
      position: relative;
      display: flex;
      //   font-size: 1em;
      &.has-zhuyin {
        --zhuyin-size: 0.375em;
        --tone-width: 6px;
        padding-right: calc(var(--zhuyin-size) + var(--tone-width));
        // padding-right: var(--zhuyin-size);
      }
      .zhuyin-container {
        --size: var(--zhuyin-size);
        font-size: var(--size);
        position: absolute;
        right: calc(-1 * var(--size) + var(--tone-width, 0px));

        // transform: translateY(-50%);
        color: #333;
        // 直向
        display: flex;
        align-items: center;

        .zhuyin {
          writing-mode: vertical-rl;
        }

        .tone {
          width: var(--tone-width);
          font-size: 24px;
          // vertical-align: bottom;
          margin-top: 50%;
        }

        &[data-tone="˙"] {
          .tone {
            margin-top: 0;
            position: absolute;
            left: 50%;
            transform: translateX(-50%) translateY(-30%);
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      .zhuyin-container[data-zhuyin-length="1"] {
        top: 25%;
        .tone {
          margin-top: 0%;
          // font-size: 20px;
        }
      }
      .zhuyin-container[data-zhuyin-length="2"] {
        top: 15%;
        .tone {
          // margin-top: 50%;
        }
      }
      .zhuyin-container[data-zhuyin-length="3"] {
        top: 5%;
        .tone {
          // margin-top: 70%;
        }
      }
    }
  }

  .pinyin-container {
    display: grid;
    grid-template-areas: var(--grid-areas);
    font-size: 14px;
    color: #666;
    .pinyin {
      grid-area: var(--grid-area);
      display: flex;
      justify-content: center;
    }
  }
}
</style>
