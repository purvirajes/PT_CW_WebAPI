-- Users
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@bookreview.com', '$2b$10$1iUJyA.jqMZnP1vWMpjX9uJruk9Itd7YXIr.6W30xWlEYAtU3fKXC', 'admin'),
('jsmith', 'john.smith@example.com', '$2b$10$Xe0o5CSMwnGCfCsdJpM16.Ym.YJwUJrvAwnXyBzwCUxu.KPXXDf/i', 'user'),
('emjones', 'emily.jones@example.com', '$2b$10$Z73BvjKW6FBT/9KOsIDdEugVEz9eiGc5YVURr6QBpZdN1cQNv.s8q', 'user'),
('mwilliams', 'michael.williams@example.com', '$2b$10$3AZre5FD1JAKBvK8Ag55S.S9N5T8sVQCHGjTJZQnZ8AgAHblYTFS.', 'user'),
('sbrown', 'sarah.brown@example.com', '$2b$10$pBGMmYRUGJDkqM5eJZ9EF.t3jcLxTECO8ONHpV6bSZG8P76BVm5eW', 'user'),
('rdavis', 'robert.davis@example.com', '$2b$10$5eIo.Va5EiC3UUEhM5JQI.RyodkN90PZPeGtB00AKcQpVPzXEqUZG', 'user');

-- Authors
INSERT INTO authors (name, bio) VALUES
('J.K. Rowling', 'British author known for the Harry Potter series, which has won multiple awards and sold more than 500 million copies.'),
('George Orwell', 'English novelist, essayist, and critic. His work is characterized by lucid prose, social criticism, opposition to totalitarianism, and support of democratic socialism.'),
('Jane Austen', 'English novelist known primarily for her six major novels, which interpret, critique, and comment upon the British landed gentry at the end of the 18th century.'),
('Stephen King', 'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.'),
('Agatha Christie', 'English writer known for her 66 detective novels and 14 short story collections, particularly those revolving around fictional detectives Hercule Poirot and Miss Marple.'),
('Toni Morrison', 'American novelist, essayist, book editor, and college professor. Her novels are known for their epic themes, vivid dialogue, and richly detailed African American characters.'),
('Ernest Hemingway', 'American novelist, short-story writer, and journalist. His economical and understated style—which he termed the iceberg theory—had a strong influence on 20th-century fiction.'),
('F. Scott Fitzgerald', 'American novelist, essayist, and short story writer, widely regarded as one of the greatest American writers of the 20th century.'),
('Haruki Murakami', 'Japanese writer whose books and stories have been bestsellers in Japan and internationally, with his work translated into 50 languages.'),
('Gabriel García Márquez', 'Colombian novelist, short-story writer, screenwriter, and journalist, known for his magical realism style and considered one of the most significant authors of the 20th century.');

-- Genres
INSERT INTO genres (name) VALUES
('Fantasy'),
('Science Fiction'),
('Mystery'),
('Thriller'),
('Romance'),
('Historical Fiction'),
('Biography'),
('Horror'),
('Young Adult'),
('Literary Fiction');

-- Books
INSERT INTO books (title, summary, authorID, imageURL) VALUES
('Harry Potter and the Philosopher''s Stone', 'The first novel in the Harry Potter series. It follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday.', 1, 'https://covers.openlibrary.org/b/id/10521270-L.jpg'),
('1984', 'A dystopian novel published in 1949. It depicts a totalitarian future society where citizens are under constant surveillance by the government.', 2, 'https://covers.openlibrary.org/b/id/8579174-L.jpg'),
('Pride and Prejudice', 'A romantic novel of manners that satirizes issues of marriage, social class, and misunderstandings among the landed gentry.', 3, 'https://covers.openlibrary.org/b/id/12645114-L.jpg'),
('The Shining', 'A horror novel about a family that heads to an isolated hotel for the winter where a sinister presence influences the father into violence.', 4, 'https://covers.openlibrary.org/b/id/8643691-L.jpg'),
('Murder on the Orient Express', 'A detective novel featuring the Belgian detective Hercule Poirot. It involves a murder on the Orient Express train and thirteen suspects.', 5, 'https://covers.openlibrary.org/b/id/9276716-L.jpg'),
('Beloved', 'A 1987 novel that follows a former African-American slave and her journey to freedom. It deals with themes of love, family, and the impact of slavery.', 6, 'https://covers.openlibrary.org/b/id/7089475-L.jpg'),
('The Old Man and the Sea', 'A short novel about an aging Cuban fisherman who struggles with a giant marlin far out in the Gulf Stream.', 7, 'https://covers.openlibrary.org/b/id/8119453-L.jpg'),
('The Great Gatsby', 'A 1925 novel that examines themes of decadence, idealism, resistance to change, social upheaval, and excess.', 8, 'https://covers.openlibrary.org/b/id/8761900-L.jpg'),
('Norwegian Wood', 'A novel about loss and heartbreak in a Japan of the 1960s. It deals with the themes of death and the meaning of existence.', 9, 'https://covers.openlibrary.org/b/id/8745744-L.jpg'),
('One Hundred Years of Solitude', 'A landmark novel that tells the multi-generational story of the Buendía family in the fictional town of Macondo.', 10, 'https://covers.openlibrary.org/b/id/7101248-L.jpg');

-- Reviews
INSERT INTO reviews (content, userID, bookID, rating) VALUES
-- Reviews for Book 1 (Harry Potter)
('An enchanting start to an amazing series. The world-building is fantastic!', 2, 1, 5),
('I loved the characters and the magical setting. Perfect for all ages.', 3, 1, 4),

-- Reviews for Book 2 (1984)
('A chilling vision of a dystopian future that feels more relevant than ever.', 4, 2, 5),
('Thought-provoking and disturbing. A must-read classic.', 5, 2, 4),

-- Reviews for Book 3 (Pride and Prejudice)
('A timeless classic with witty dialogue and memorable characters.', 2, 3, 4),
('I found the pacing a bit slow, but the ending was worth it.', 3, 3, 3),

-- Reviews for Book 4 (The Shining)
('One of the scariest books I''ve ever read. Kept me up all night!', 4, 4, 5),
('King''s masterpiece of psychological horror. The tension builds perfectly.', 5, 4, 5),

-- Reviews for Book 5 (Murder on the Orient Express)
('Ingenious plot twists and a satisfying conclusion. Christie at her best.', 2, 5, 4),
('A classic whodunit with one of the most surprising endings in mystery fiction.', 3, 5, 5),

-- Reviews for Book 6 (Beloved)
('A powerful and haunting novel that stays with you long after reading.', 4, 6, 5),
('Beautifully written but emotionally devastating. A literary masterpiece.', 5, 6, 5),

-- Reviews for Book 7 (The Old Man and the Sea)
('Hemingway''s sparse prose perfectly captures the struggle between man and nature.', 2, 7, 4),
('A deceptively simple story with profound themes of perseverance and dignity.', 3, 7, 4),

-- Reviews for Book 8 (The Great Gatsby)
('A brilliant portrayal of the excesses of the Jazz Age.', 4, 8, 5),
('Fitzgerald''s prose is lyrical and evocative. A true American classic.', 5, 8, 5),

-- Reviews for Book 9 (Norwegian Wood)
('A melancholic and beautiful story of youth and love.', 2, 9, 4),
('Murakami''s writing style is mesmerizing. I couldn''t put it down.', 3, 9, 5),

-- Reviews for Book 10 (One Hundred Years of Solitude)
('A masterpiece of magical realism. Complex and rewarding.', 4, 10, 5),
('The multi-generational story is captivating but can be challenging to follow.', 5, 10, 4);