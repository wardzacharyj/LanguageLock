#!/usr/bin/env python

import sys
import json
import os.path

CSV_EXT = ".csv"
JSON_EXT = ".json"

VALID_COLUMN_LABELS = {
    "primary": 0,
    "intermediate": 0 ,
    "meaining": 0, 
    "native" : 0
}

VALID_SEP_FLAGS = {
    "-c": ",",
    "-t": "\t"
}


def usage():
    """
    Displays csv script usage flag descriptions

    """

    print("\n\n--> USAGE\n\n")
    print(" $ chmod +x csv_parser.py")
    print(" $ ./csv_parser.py [-c, -t] <csv_file_path_1> <csv_file_path_2> ...")
    print("\n                         --OR--\n")
    print(" $ python3 csv_parser.py <csv_file_path_1> <csv_file_path_2> ...")
    print("-----------------------------------------------------------------------")
    print("\n--> FLAGS\n")
    print("----- Separator Flags")
    print()
    print("-c")
    print("\tdenotes the following csv are comma-separated")
    print()
    print("-t")
    print("\tdenotes the following csv are tab-separated")
    print()
    print("\n\n")


def validateInputFiles(args):
    """
    Determines whether or not the csv files provided have csv file extensions
    and exist 

    :param args: the array of csv files command-line arguements
    :returns: true when all of the provided files exist and have csv extensions, otherwise false

    """

    file_list = []
    for csv_file in args:
        if csv_file[-4:] == CSV_EXT and os.path.isfile(csv_file):
            file_list.append(csv_file)
        elif csv_file[-4:] != CSV_EXT:
            print("\nError: CSV file extension does not exist for %s\n" % (csv_file))
            exit(-1)
        else:
            print("\nError: %s was not found. Make sure you specify a valid absolute or realtive path \n" % (csv_file))
            exit(-1)

    return file_list

def generateTermLabels(file_header):
    """
    Creates the numbered labels for each json term object in accordance with their csv's header

    :param file_header: the file_header which provides every term objects field labels
    :returns: the numbered file_header labels or an empty array when the csv contains an invalid term template
    
    """

    labels = []
    for label in file_header:
        label = label.lower()
        if label not in VALID_COLUMN_LABELS:
            return []
        else:
            VALID_COLUMN_LABELS[label] += 1
            labels.append("%s_%d" % (label, VALID_COLUMN_LABELS[label]))
    return labels


def convert(csv_files, sep=","):
    """
    Iterates through all csv files and coverts them into a single json array based on the csv's
    term template header. This json array is then outputed to the same directory as the associated
    csv file

    :param csv_files: the array of csv file names
    :param sep: the delimeter for the list of csv files 

    """

    for csv in csv_files:
        with open(csv) as file:
            labels = generateTermLabels((file.readline().rstrip("\n").strip()).split(sep))
            if len(labels) == 0:
                print("\nError: The column header for \"%s\" is invalid... aborting conversion\n" % csv)
                continue

            # Read in all terms contained in the csv file
            term_array = []
            for i, line in enumerate(file, start=1):

                # term_data = [item.strip() for item in (line.rstrip("\n").split(sep))]
                term_data = []
                for item in (line.rstrip("\n").strip()).split(sep):
                    term_data.append(item)

                if len(labels) != len(term_data):
                    print(term_data)
                    print("\nError while reading: %s\nLine %d does not contain the file's %d specified labeled values.\n" % (csv, i, len(labels)))
                    exit(-1)
                else:
                    term_object = {}
                    for index in range(len(labels)):
                        term_object[labels[index]] = term_data[index]

                    term_array.append(term_object)
            
            with open(csv[:len(csv)-4]+JSON_EXT, "w") as json_output:
                json_output.write(json.dumps(term_array, indent=4, sort_keys=True, ensure_ascii=False))

def main():
    sys.argv.pop(0)
    if("-h" in sys.argv):
        usage()
        exit(0)

    if(len(sys.argv) == 1):
        print("\nError: You must specify at least one csv file and the csv separator. Run with -h for more details\n")
        exit(0)

    if(sys.argv[0] not in VALID_SEP_FLAGS):
        print("\nError: Invalid seperator argument provided: %s\n Valid separators %s" % (sys.argv[0], str(VALID_SEP_FLAGS.keys())))
        exit(-1)
    
    sep = VALID_SEP_FLAGS[sys.argv[0]]
    sys.argv.pop(0)
    convert(validateInputFiles(sys.argv), sep)


if __name__ == "__main__":
    main()