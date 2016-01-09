import indicoio as ind
import operator as op

ind.config.api_key = "b1b29987309a10beab53d428a70699d3"

data = open("text.txt").read()


def sort(data):
    sorted_data = sorted(data.items(), key=op.itemgetter(1))
    return sorted_data[::-1]


def analysis(data):
    sentiment = ind.sentiment_hq(data)
    tags = sort(ind.text_tags(data))
    languages = sort(ind.language(data))
    politics = sort(ind.political(data))
    keywords = sort(ind.keywords(data))
    names = sort(ind.named_entities(data))

    print "Sentiment", sentiment

    print "\n\n\nTags"
    for t in tags:
        print t[0], float(t[1]) * 100

    print "\n\n\nLanguages"
    for l in languages:
        print l[0], float(l[1]) * 100

    print "\n\n\nPolitical"
    for p in politics:
        print p[0], float(p[1]) * 100
    
    print "\n\nkeywords"
    for k in keywords:
        print k[0], float(k[1]) * 100


def main():
    analysis(data)


if __name__ == '__main__':
    main()
