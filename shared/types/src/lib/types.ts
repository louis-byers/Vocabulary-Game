export interface Author {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Word {
  word: string;
  hint: string;
}

export interface WordList {
  id: string;
  name: string;
  words: Word[];
}

export interface Data {
  author: Author;
  id: string;
  course_title: string;
  course_code: string;
  last_updated: Date;
  word_lists: WordList[];
}
