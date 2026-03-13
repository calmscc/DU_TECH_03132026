def calculate_visibility(mentions,total_prompts):

    visibility = {}

    for engine,count in mentions.items():

        visibility[engine] = round(
            (count/total_prompts)*100
        )

    return visibility
