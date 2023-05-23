// NOTE: id, title, text and tip should be non-empty strings
export const tutorialTooltipContent = [
    {
        id: "start",
        title: "Start",
        text: "Each network consists of circles that are connected by arrows of different colour.",
        tip: "Click OK",
    },
    {
        id: "practice_node",
        title: "Circle",
        text: "You start at the highlighted circle.",
        tip: "Click a node",
    },
    {
        id: "general_edge",
        title: "ArrowGeneral",
        text: "From there, you can follow any outgoing arrow. The arrow colour indicates how many points you will lose or gain on the path along the arrow.",
        tip: "Click OK",
    },
    {
        id: "practice_edge",
        title: "Arrow",
        text: "Your goal is to select a path along the arrows to earn points. Now click on the next node.",
        tip: "Click a node",
    },
    {
        id: "general_points",
        title: "Score & Step",
        text: "You always make 8 moves per network. Your goal is to collect the maximum number of points in these 8 moves.",
        tip: "Current step and cumulative score",
    },
    {
        id: "practice_linear_solution",
        title: "Your Solution",
        text: "As you proceed in the network, your progress is noted here. Now finish the round by making your 8 moves.",
        tip: "Your Solution",
    },
    {
        id: "practice_timer",
        title: "Time Constraint",
        text: "In the actual experiment, you will have limited time to solve each network. If you run out of time, you will receive -50 points for each missing move.",
        tip: "Time Constraint",
    },
    {
        id: "practice_step_score",
        title: "Current Network Score",
        text: "Your point-count for the current network will be displayed here.",
        tip: "Cumulative score",
    },
    {
        id: "practice_total_score",
        title: "Total Score",
        text: "Your total point-count will be displayed here, once the main task starts.",
        tip: "Total Score",

    },
    {
        id: "social_learning_selection_player",
        title: "Player Selection",
        text: "Select a player to learn from. Scores displayed are the average scores obtained during the players’ experiments.",
        tip: "Select a player",
    },
    {
        id: "social_learning_observation_comment",
        title: "Player Comment",
        text: "The player might have provided their strategy for you here (or not, if the box is empty).",
        tip: "Player comment",
    },
    {
        id: "social_learning_observation_animation",
        title: "Player Solution Animation",
        text: "You can now watch their chosen path once. The animation will start in 4 seconds.",
        tip: "Player solution animation",
    },
];