import re

def relevance_score(user_preferences, movie_description):
    """
    Calculate the relevance score of a movie recommendation based on the user's preferences.
    
    Args:
    - user_preferences (dict): A dictionary containing the user's genre, mood, or other preferences.
    - movie_description (str): A description of the recommended movie.
    
    Returns:
    - score (float): A relevance score between 1 and 5.
    """
    # Define a set of keywords based on the user's preferences
    relevant_keywords = set()
    relevant_keywords.update(user_preferences.get('genres', []))
    relevant_keywords.update(user_preferences.get('mood', []))

    # Convert movie description to lowercase for case-insensitive matching
    movie_description = movie_description.lower()
    
    # Calculate the number of relevant keywords found in the movie description
    matches = 0
    for keyword in relevant_keywords:
        # Use regular expressions to find exact word matches
        if re.search(r'\b' + re.escape(keyword) + r'\b', movie_description):
            matches += 1
    
    # Normalize the score based on the number of matched keywords
    max_score = len(relevant_keywords)
    score = (matches / max_score) * 100  # Scale to a 0-100 range

    return round(score, 2)


# Example user preferences
user_preferences = {
    'genres': ['action', 'war'],
    'mood': ['thrilling', 'intense action ', 'adrenaline-pumping']
}

# Example movie description
movie_description = "This film fits your preference for war movies and features intense action scenes, high stakes, and compelling characters. The description mentions a sniper making a 'sniper terror' for the enemy, which sounds like an adrenaline-pumping and strategic experience that you might enjoy."

# Calculate the relevance score
score = relevance_score(user_preferences, movie_description)
print(f"Relevance Score: {score}")
